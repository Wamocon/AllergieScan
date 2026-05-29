import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { getHandbook } from '@/lib/handbook/content'

export const runtime = 'nodejs'

/**
 * Renders the handbook as a real, structured PDF document using pdf-lib.
 * Pure JS - no filesystem dependencies (works with Turbopack/Vercel).
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'de'
  const handbook = getHandbook(locale)

  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(handbook.title)
  pdfDoc.setAuthor('WAMOCON GmbH')
  pdfDoc.setSubject(handbook.subtitle)
  pdfDoc.setKeywords(['AllergieScan', 'Allergie', 'Handbuch', 'Manual'])

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  const brand = rgb(26 / 255, 77 / 255, 58 / 255)
  const textColor = rgb(26 / 255, 26 / 255, 26 / 255)
  const muted = rgb(125 / 255, 117 / 255, 105 / 255)
  const borderColor = rgb(212 / 255, 200 / 255, 176 / 255)

  const PAGE_W = 595.28 // A4
  const PAGE_H = 841.89
  const MARGIN = 64
  const CONTENT_W = PAGE_W - 2 * MARGIN

  // Helper: add footer to a page
  function addFooter(page: ReturnType<typeof pdfDoc.addPage>, pageNum: number, totalPages: number) {
    page.drawText(`AllergieScan - ${handbook.title}`, {
      x: MARGIN,
      y: 30,
      size: 8,
      font: helvetica,
      color: muted,
    })
    const numText = `${pageNum} / ${totalPages}`
    const numWidth = helvetica.widthOfTextAtSize(numText, 8)
    page.drawText(numText, {
      x: PAGE_W - MARGIN - numWidth,
      y: 30,
      size: 8,
      font: helvetica,
      color: muted,
    })
  }

  // Helper: wrap text and return lines
  function wrapText(text: string, font: typeof helvetica, size: number, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        currentLine = test
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines
  }

  // ---- Cover page ----
  const cover = pdfDoc.addPage([PAGE_W, PAGE_H])
  cover.drawText('ALLERGIESCAN', {
    x: MARGIN,
    y: PAGE_H - MARGIN - 12,
    size: 11,
    font: helveticaBold,
    color: brand,
  })
  cover.drawText(handbook.title, {
    x: MARGIN,
    y: PAGE_H - 300,
    size: 36,
    font: helvetica,
    color: textColor,
  })
  cover.drawText(handbook.subtitle, {
    x: MARGIN,
    y: PAGE_H - 340,
    size: 13,
    font: helveticaOblique,
    color: muted,
  })
  const dateStr = new Date().toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE', { year: 'numeric', month: 'long' })
  cover.drawText(`Version ${handbook.version}`, { x: MARGIN, y: 100, size: 9, font: helvetica, color: muted })
  cover.drawText(dateStr, { x: MARGIN, y: 86, size: 9, font: helvetica, color: muted })
  cover.drawText('WAMOCON GmbH, Eschborn', { x: MARGIN, y: 72, size: 9, font: helvetica, color: muted })

  // ---- TOC page ----
  const tocPage = pdfDoc.addPage([PAGE_W, PAGE_H])
  tocPage.drawText(locale === 'en' ? 'TABLE OF CONTENTS' : 'INHALT', {
    x: MARGIN, y: PAGE_H - MARGIN - 12, size: 10, font: helveticaBold, color: brand,
  })
  let tocY = PAGE_H - MARGIN - 50
  handbook.sections.forEach((section, i) => {
    const num = String(i + 1).padStart(2, '0')
    tocPage.drawText(`${num}    ${section.title}`, {
      x: MARGIN, y: tocY, size: 13, font: helvetica, color: textColor,
    })
    tocY -= 18
    const introLines = wrapText(section.intro, helveticaOblique, 10, CONTENT_W - 40)
    for (const line of introLines) {
      tocPage.drawText(`         ${line}`, {
        x: MARGIN, y: tocY, size: 10, font: helveticaOblique, color: muted,
      })
      tocY -= 14
    }
    tocY -= 8
  })

  // ---- Section pages ----
  handbook.sections.forEach((section, i) => {
    let page = pdfDoc.addPage([PAGE_W, PAGE_H])
    let y = PAGE_H - MARGIN

    const num = String(i + 1).padStart(2, '0')
    page.drawText(num, { x: MARGIN, y, size: 10, font: helveticaBold, color: brand })
    y -= 28
    page.drawText(section.title, { x: MARGIN, y, size: 26, font: helvetica, color: textColor })
    y -= 22

    const introLines = wrapText(section.intro, helveticaOblique, 12, CONTENT_W)
    for (const line of introLines) {
      page.drawText(line, { x: MARGIN, y, size: 12, font: helveticaOblique, color: muted })
      y -= 16
    }
    y -= 10

    // Separator line
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.5,
      color: borderColor,
    })
    y -= 20

    // Render blocks
    for (const block of section.blocks) {
      // Check if we need a new page
      if (y < 80) {
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        y = PAGE_H - MARGIN
      }

      switch (block.type) {
        case 'h3': {
          y -= 8
          page.drawText(block.text, { x: MARGIN, y, size: 14, font: helveticaBold, color: textColor })
          y -= 20
          break
        }
        case 'p': {
          const lines = wrapText(block.text, helvetica, 11, CONTENT_W)
          for (const line of lines) {
            if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
            page.drawText(line, { x: MARGIN, y, size: 11, font: helvetica, color: textColor })
            y -= 16
          }
          y -= 8
          break
        }
        case 'ul': {
          for (const item of block.items) {
            if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
            const lines = wrapText(item, helvetica, 11, CONTENT_W - 16)
            page.drawText('-', { x: MARGIN, y, size: 11, font: helvetica, color: brand })
            for (let li = 0; li < lines.length; li++) {
              if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
              page.drawText(lines[li], { x: MARGIN + 16, y, size: 11, font: helvetica, color: textColor })
              y -= 16
            }
          }
          y -= 8
          break
        }
        case 'ol': {
          for (let idx = 0; idx < block.items.length; idx++) {
            if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
            const lines = wrapText(block.items[idx], helvetica, 11, CONTENT_W - 20)
            page.drawText(`${idx + 1}.`, { x: MARGIN, y, size: 11, font: helveticaBold, color: brand })
            for (let li = 0; li < lines.length; li++) {
              if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
              page.drawText(lines[li], { x: MARGIN + 20, y, size: 11, font: helvetica, color: textColor })
              y -= 16
            }
          }
          y -= 8
          break
        }
        case 'note': {
          const noteLines = wrapText(block.text, helveticaOblique, 10, CONTENT_W - 20)
          const noteStartY = y
          for (const line of noteLines) {
            if (y < 60) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
            page.drawText(line, { x: MARGIN + 12, y, size: 10, font: helveticaOblique, color: brand })
            y -= 14
          }
          // Side bar for the note
          page.drawLine({
            start: { x: MARGIN + 4, y: noteStartY + 4 },
            end: { x: MARGIN + 4, y: y + 2 },
            thickness: 2,
            color: brand,
          })
          y -= 12
          break
        }
      }
    }
  })

  // ---- Add footers to all pages ----
  const pages = pdfDoc.getPages()
  const totalPages = pages.length
  pages.forEach((page, idx) => {
    addFooter(page, idx + 1, totalPages)
  })

  const pdfBytes = await pdfDoc.save()
  const filename = `allergiescan-handbuch-${locale}-v${handbook.version}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
