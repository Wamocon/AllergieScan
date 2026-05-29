import fs from 'fs/promises'
import path from 'path'

function renderMarkdown(md: string): string {
  let html = md
  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')
  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  // Clean empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>\s*(<h[1-6]>)/g, '$1')
  html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<hr \/>)/g, '$1')
  html = html.replace(/(<hr \/>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1')
  return html
}

function fillPlaceholders(text: string): string {
  const now = new Date()
  const months = ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return text
    .replace(/\{\{MONAT\}\}/g, months[now.getMonth()])
    .replace(/\{\{JAHR\}\}/g, String(now.getFullYear()))
    .replace(/\{\{PROJEKTNAME\}\}/g, 'AllergieScan')
    .replace(/\{\{PROJEKT_EMAIL\}\}/g, 'info@allergiescan.eu')
    .replace(/\{\{DOMAIN\}\}/g, 'allergiescan.eu')
    .replace(/\{\{BESCHREIBUNG_DES_ANGEBOTS\}\}/g, 'die allergenbasierte Produktpruefung fuer Allergiker')
}

export async function LegalContent({ file }: { file: string }) {
  const filePath = path.join(process.cwd(), 'legal-docs', file)
  const raw = await fs.readFile(filePath, 'utf-8')
  const filled = fillPlaceholders(raw)
  // Remove the "Hinweis" line about placeholders
  const cleaned = filled.replace(/> \*\*Hinweis:\*\*.+$/gm, '')
  const html = renderMarkdown(cleaned)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
