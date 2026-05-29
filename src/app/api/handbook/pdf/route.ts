import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import PDFDocument from 'pdfkit'
import { getHandbook } from '@/lib/handbook/content'

export const runtime = 'nodejs'

// pdfkit resolves AFM font data relative to cwd which may differ in dev/Turbopack.
// Use process.cwd() which is always the project root at runtime in Next.js.
const PDFKIT_AFM_DIR = path.resolve(process.cwd(), 'node_modules', 'pdfkit', 'js', 'data')

/**
 * Renders the handbook as a real, structured PDF document
 * (not a print preview). Uses pdfkit for typography and layout.
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'de'
  const handbook = getHandbook(locale)

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 64,
      info: {
        Title: handbook.title,
        Author: 'WAMOCON GmbH',
        Subject: handbook.subtitle,
        Keywords: 'AllergieScan, Allergie, Handbuch, Manual',
      },
    })

    // Register standard fonts with absolute paths so Turbopack/dev CWD issues are bypassed
    doc.registerFont('Helvetica', path.join(PDFKIT_AFM_DIR, 'Helvetica.afm'))
    doc.registerFont('Helvetica-Bold', path.join(PDFKIT_AFM_DIR, 'Helvetica-Bold.afm'))
    doc.registerFont('Helvetica-Oblique', path.join(PDFKIT_AFM_DIR, 'Helvetica-Oblique.afm'))

    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // brand colors
    const brand = '#1a4d3a'
    const text = '#1a1a1a'
    const muted = '#7d7569'
    const border = '#d4c8b0'

    // ---- Cover ----
    doc.fillColor(brand).fontSize(11).font('Helvetica-Bold').text('ALLERGIESCAN', { characterSpacing: 4 })
    doc.moveDown(8)
    doc.fillColor(text).fontSize(36).font('Helvetica').text(handbook.title, { lineGap: 6 })
    doc.moveDown(0.5)
    doc.fillColor(muted).fontSize(13).font('Helvetica-Oblique').text(handbook.subtitle)
    doc.moveDown(8)
    doc.fillColor(muted).fontSize(9).font('Helvetica').text(`Version ${handbook.version}`)
    doc.fillColor(muted).fontSize(9).text(new Date().toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE', { year: 'numeric', month: 'long' }))
    doc.fillColor(muted).fontSize(9).text('WAMOCON GmbH, Eschborn')

    // ---- TOC ----
    doc.addPage()
    doc.fillColor(brand).fontSize(10).font('Helvetica-Bold').text(locale === 'en' ? 'TABLE OF CONTENTS' : 'INHALT', { characterSpacing: 3 })
    doc.moveDown(1.5)
    handbook.sections.forEach((section, i) => {
      const num = String(i + 1).padStart(2, '0')
      doc.fillColor(text).fontSize(13).font('Helvetica')
      doc.text(`${num}    ${section.title}`, { lineGap: 4 })
      doc.fillColor(muted).fontSize(10).font('Helvetica-Oblique')
      doc.text(`         ${section.intro}`, { lineGap: 10 })
    })

    // ---- Sections ----
    handbook.sections.forEach((section, i) => {
      doc.addPage()
      const num = String(i + 1).padStart(2, '0')
      doc.fillColor(brand).fontSize(10).font('Helvetica-Bold').text(num, { characterSpacing: 3 })
      doc.moveDown(0.4)
      doc.fillColor(text).fontSize(26).font('Helvetica').text(section.title, { lineGap: 4 })
      doc.fillColor(muted).fontSize(12).font('Helvetica-Oblique').text(section.intro)
      doc.moveDown(1)

      // separator line
      const y = doc.y
      doc.moveTo(64, y).lineTo(531, y).strokeColor(border).lineWidth(0.5).stroke()
      doc.moveDown(1)

      section.blocks.forEach((block) => {
        switch (block.type) {
          case 'h3':
            doc.moveDown(0.6)
            doc.fillColor(text).fontSize(14).font('Helvetica-Bold').text(block.text, { lineGap: 4 })
            doc.moveDown(0.2)
            break
          case 'p':
            doc.fillColor(text).fontSize(11).font('Helvetica').text(block.text, { align: 'left', lineGap: 4 })
            doc.moveDown(0.6)
            break
          case 'ul':
            block.items.forEach((item) => {
              doc.fillColor(brand).fontSize(11).font('Helvetica').text('-  ', { continued: true })
              doc.fillColor(text).text(item, { lineGap: 4 })
            })
            doc.moveDown(0.6)
            break
          case 'ol':
            block.items.forEach((item, idx) => {
              doc.fillColor(brand).fontSize(11).font('Helvetica-Bold').text(`${idx + 1}.  `, { continued: true })
              doc.fillColor(text).font('Helvetica').text(item, { lineGap: 4 })
            })
            doc.moveDown(0.6)
            break
          case 'note': {
            const startY = doc.y
            doc.fillColor(brand).fontSize(10).font('Helvetica-Oblique').text(block.text, 80, startY + 6, {
              width: 451,
              lineGap: 3,
            })
            const endY = doc.y
            doc.moveTo(72, startY + 4).lineTo(72, endY + 2).strokeColor(brand).lineWidth(2).stroke()
            doc.moveDown(0.8)
            break
          }
        }
      })
    })

    // ---- Footer on each page ----
    const range = doc.bufferedPageRange()
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i)
      doc.fillColor(muted).fontSize(8).font('Helvetica').text(
        `AllergieScan - ${handbook.title}`,
        64,
        doc.page.height - 40,
        { width: 467, align: 'left' },
      )
      doc.text(`${i + 1} / ${range.count}`, 64, doc.page.height - 40, {
        width: 467,
        align: 'right',
      })
    }

    doc.end()
  })

  const filename = `allergiescan-handbuch-${locale}-v${handbook.version}.pdf`
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
