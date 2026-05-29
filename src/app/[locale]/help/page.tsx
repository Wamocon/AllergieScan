import { getLocale } from 'next-intl/server'
import { HandbookViewer } from '@/components/HandbookViewer'
import { getHandbook } from '@/lib/handbook/content'

export default async function HelpPage() {
  const locale = await getLocale()
  const handbook = getHandbook(locale)

  return <HandbookViewer handbook={handbook} />
}
