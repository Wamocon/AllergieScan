import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface OpenFoodFactsProduct {
  product_name?: string
  brands?: string
  ingredients_text_de?: string
  ingredients_text?: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ean: string }> }
) {
  const { ean } = await params

  if (!ean || !/^\d{8,13}$/.test(ean)) {
    return NextResponse.json({ error: 'Invalid EAN code' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Check local database first
  const { data: localProduct } = await supabase
    .from('products')
    .select('id, ean, name, brand, ingredients_text, data_quality')
    .eq('ean', ean)
    .single()

  if (localProduct) {
    return NextResponse.json({
      product: localProduct,
      source: 'local',
    })
  }

  // 1b. Check product cache (V8)
  const { data: cached } = await supabase
    .from('product_cache')
    .select('ean, name, brand, ingredients_text')
    .eq('ean', ean)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (cached) {
    return NextResponse.json({
      product: cached,
      source: 'cache',
    })
  }

  // 2. Fall back to OpenFoodFacts
  try {
    const offResponse = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${ean}.json?fields=product_name,brands,ingredients_text_de,ingredients_text`,
      { next: { revalidate: 3600 } }
    )

    if (!offResponse.ok) {
      return NextResponse.json({ product: null, source: 'not_found' })
    }

    const offData = await offResponse.json()

    if (offData.status !== 1 || !offData.product) {
      return NextResponse.json({ product: null, source: 'not_found' })
    }

    const offProduct = offData.product as OpenFoodFactsProduct
    const ingredientsText = offProduct.ingredients_text_de || offProduct.ingredients_text || ''

    if (!ingredientsText) {
      return NextResponse.json({
        product: {
          ean,
          name: offProduct.product_name || 'Unknown',
          brand: offProduct.brands || '',
          ingredients_text: '',
        },
        source: 'openfoodfacts',
        warning: 'no_ingredients',
      })
    }

    // 3. Save to local DB for future lookups
    const { data: saved } = await supabase
      .from('products')
      .insert({
        ean,
        name: offProduct.product_name || 'Unknown',
        brand: offProduct.brands || '',
        ingredients_text: ingredientsText,
        source: 'openfoodfacts',
        data_quality: 'unverified',
      })
      .select('id, ean, name, brand, ingredients_text')
      .single()

    // 3b. Also populate product cache (V8)
    await supabase
      .from('product_cache')
      .upsert({
        ean,
        name: offProduct.product_name || 'Unknown',
        brand: offProduct.brands || '',
        ingredients_text: ingredientsText,
        raw_data: offProduct,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })

    return NextResponse.json({
      product: saved || { ean, name: offProduct.product_name, brand: offProduct.brands, ingredients_text: ingredientsText },
      source: 'openfoodfacts',
    })
  } catch {
    return NextResponse.json({ product: null, source: 'error' }, { status: 502 })
  }
}
