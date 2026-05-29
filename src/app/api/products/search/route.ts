import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface OpenFoodFactsSearchProduct {
  code?: string
  product_name?: string
  brands?: string
  ingredients_text_de?: string
  ingredients_text?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [] })
  }

  const supabase = createAdminClient()

  // 1. Search local database
  const { data: localProducts } = await supabase
    .from('products')
    .select('id, ean, name, brand, ingredients_text')
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%,ean.eq.${query}`)
    .limit(10)

  const local = localProducts || []

  // 2. If fewer than 5 local results, also search OpenFoodFacts
  if (local.length < 5) {
    try {
      const offResults = await searchOpenFoodFacts(query, 10 - local.length)

      // Save OFF results to local DB for future searches
      for (const offProduct of offResults) {
        if (offProduct.ean && offProduct.ingredients_text) {
          // Check if already exists locally
          const exists = local.some((p) => p.ean === offProduct.ean)
          if (!exists) {
            const { data: saved } = await supabase
              .from('products')
              .upsert(
                {
                  ean: offProduct.ean,
                  name: offProduct.name,
                  brand: offProduct.brand,
                  ingredients_text: offProduct.ingredients_text,
                  source: 'openfoodfacts',
                  data_quality: 'unverified',
                },
                { onConflict: 'ean' }
              )
              .select('id, ean, name, brand, ingredients_text')
              .single()

            if (saved) {
              local.push(saved)
            }
          }
        }
      }
    } catch {
      // OpenFoodFacts unavailable - return local results only
    }
  }

  return NextResponse.json({ products: local })
}

async function searchOpenFoodFacts(
  query: string,
  limit: number
): Promise<{ ean: string; name: string; brand: string; ingredients_text: string }[]> {
  const url = new URL('https://world.openfoodfacts.org/cgi/search.pl')
  url.searchParams.set('search_terms', query)
  url.searchParams.set('search_simple', '1')
  url.searchParams.set('action', 'process')
  url.searchParams.set('json', '1')
  url.searchParams.set('page_size', String(limit))
  url.searchParams.set('fields', 'code,product_name,brands,ingredients_text_de,ingredients_text')
  // Prefer German/Austrian/Swiss products
  url.searchParams.set('tagtype_0', 'countries')
  url.searchParams.set('tag_contains_0', 'contains')
  url.searchParams.set('tag_0', 'germany')

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': 'AllergieScan/1.0 (allergiescan.eu)' },
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) return []

  const data = await response.json()
  const products: OpenFoodFactsSearchProduct[] = data.products || []

  return products
    .filter((p) => p.code && p.product_name)
    .map((p) => ({
      ean: p.code || '',
      name: p.product_name || '',
      brand: p.brands || '',
      ingredients_text: p.ingredients_text_de || p.ingredients_text || '',
    }))
}
