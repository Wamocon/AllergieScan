import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkProduct } from '@/lib/engine'
import type { UserAllergenConfig } from '@/lib/engine/types'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse request body
  const body = await request.json()
  const { ingredients_text, product_id } = body

  if (!ingredients_text || typeof ingredients_text !== 'string') {
    return NextResponse.json(
      { error: 'ingredients_text is required and must be a string' },
      { status: 400 }
    )
  }

  // Load user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('allergen_config')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.allergen_config || (profile.allergen_config as UserAllergenConfig[]).length === 0) {
    return NextResponse.json(
      { error: 'No allergy profile configured. Please set up your profile first.' },
      { status: 400 }
    )
  }

  const userProfile = profile.allergen_config as UserAllergenConfig[]

  // Run the check
  const result = await checkProduct(ingredients_text, userProfile)

  // Save scan result
  await supabase.from('scan_results').insert({
    user_id: user.id,
    product_id: product_id || null,
    ingredients_text,
    result: result.result,
    matched_allergens: result.matched_allergens,
    unknown_tokens: result.unknown_tokens,
    scan_source: 'text',
  })

  return NextResponse.json(result)
}
