import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()

  const { data: allergens, error } = await supabase
    .from('allergens')
    .select('id, code, name_de, name_en, category, description_de, description_en, sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to load allergens' }, { status: 500 })
  }

  return NextResponse.json({ allergens })
}
