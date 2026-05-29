import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: scans, error } = await supabase
    .from('scan_results')
    .select('id, product_id, ingredients_text, result, matched_allergens, unknown_tokens, scan_source, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 })
  }

  return NextResponse.json({ scans: scans || [] })
}
