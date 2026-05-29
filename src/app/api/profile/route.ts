import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ profile })
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { allergen_config, display_name, language, theme, birth_year } = body

  // Validate allergen_config structure
  if (allergen_config !== undefined) {
    if (!Array.isArray(allergen_config)) {
      return NextResponse.json(
        { error: 'allergen_config must be an array' },
        { status: 400 }
      )
    }

    const validRiskLevels = ['critical', 'high', 'medium']
    for (const entry of allergen_config) {
      if (!entry.allergen_id || !entry.risk_level) {
        return NextResponse.json(
          { error: 'Each allergen_config entry must have allergen_id and risk_level' },
          { status: 400 }
        )
      }
      if (!validRiskLevels.includes(entry.risk_level)) {
        return NextResponse.json(
          { error: `Invalid risk_level: ${entry.risk_level}. Must be: ${validRiskLevels.join(', ')}` },
          { status: 400 }
        )
      }
    }
  }

  const updateData: Record<string, unknown> = {}
  if (allergen_config !== undefined) updateData.allergen_config = allergen_config
  if (display_name !== undefined) updateData.display_name = display_name
  if (language !== undefined) updateData.language = language
  if (theme !== undefined) updateData.theme = theme
  if (birth_year !== undefined) updateData.birth_year = birth_year === null ? null : Number(birth_year)

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ profile })
}
