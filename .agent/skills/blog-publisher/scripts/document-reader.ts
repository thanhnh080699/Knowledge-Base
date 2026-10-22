/**
 * Document Ingestion & Translation Pre-processor
 *
 * Supports:
 * - PDF documents (via pdftotext or python pdf extraction)
 * - Word documents (.docx via python XML/docx extractor)
 * - Markdown files (.md)
 * - Web URLs (HTML parsing, stripping nav/footer/scripts, preserving links and citations)
 */

import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'

export interface IngestedDocument {
  sourceType: 'pdf' | 'docx' | 'markdown' | 'url'
  sourceLocation: string
  title: string
  rawText: string
  sections: { heading: string; level: number; content: string }[]
  extractedLinks: { text: string; url: string }[]
  citations: string[]
}

export class DocumentReader {
  /**
   * Automatically detect and ingest document based on extension or URL format
   */
  async ingest(input: string): Promise<IngestedDocument> {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return this.ingestUrl(input)
    }

    const ext = extname(input).toLowerCase()
    switch (ext) {
      case '.md':
      case '.markdown':
      case '.txt':
        return this.ingestMarkdown(input)
      case '.pdf':
        return this.ingestPdf(input)
      case '.docx':
        return this.ingestDocx(input)
      default:
        throw new Error(`Unsupported document extension "${ext}". Supported: .pdf, .docx, .md, http(s) URL`)
    }
  }

  /**
   * Ingest Markdown file
   */
  async ingestMarkdown(filePath: string): Promise<IngestedDocument> {
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    let title = ''
    const sections: { heading: string; level: number; content: string }[] = []
    const extractedLinks: { text: string; url: string }[] = []
    const citations: string[] = []

    let currentHeading = 'Introduction'
    let currentLevel = 2
    let currentBody: string[] = []

    for (const line of lines) {
      const h1Match = line.match(/^#\s+(.+)$/)
      if (h1Match && !title) {
        title = h1Match[1].trim()
        continue
      }

      const hMatch = line.match(/^(#{2,4})\s+(.+)$/)
      if (hMatch) {
        if (currentBody.length > 0) {
          sections.push({
            heading: currentHeading,
            level: currentLevel,
            content: currentBody.join('\n').trim(),
          })
          currentBody = []
        }
        currentLevel = hMatch[1].length
        currentHeading = hMatch[2].trim()
        continue
      }

      // Extract markdown links [text](url)
      const linkMatches = line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g)
      for (const match of linkMatches) {
        extractedLinks.push({ text: match[1], url: match[2] })
        if (!citations.includes(match[2])) {
          citations.push(match[2])
        }
      }

      currentBody.push(line)
    }

    if (currentBody.length > 0) {
      sections.push({
        heading: currentHeading,
        level: currentLevel,
        content: currentBody.join('\n').trim(),
      })
    }

    if (!title && sections.length > 0) {
      title = sections[0].heading
    }

    return {
      sourceType: 'markdown',
      sourceLocation: filePath,
      title: title || 'Untitled Document',
      rawText: content,
      sections,
      extractedLinks,
      citations,
    }
  }

  /**
   * Ingest PDF document
   */
  async ingestPdf(filePath: string): Promise<IngestedDocument> {
    let extractedText = ''

    // Attempt python pypdf/pymupdf or pdftotext extraction
    try {
      const pyScript = `
import sys
try:
    import pypdf
    reader = pypdf.PdfReader(sys.argv[1])
    text = "\\n".join([page.extract_text() or "" for page in reader.pages])
    print(text)
except Exception:
    try:
        import pypdf2
        reader = pypdf2.PdfReader(sys.argv[1])
        print("\\n".join([page.extract_text() or "" for page in reader.pages]))
    except Exception as e:
        sys.exit(1)
`
      extractedText = execFileSync('python3', ['-c', pyScript, filePath], { encoding: 'utf-8' })
    } catch {
      // Fallback: pdftotext CLI if installed
      try {
        extractedText = execFileSync('pdftotext', [filePath, '-'], { encoding: 'utf-8' })
      } catch {
        // Fallback: strings extraction for basic text
        extractedText = execFileSync('strings', [filePath], { encoding: 'utf-8' })
      }
    }

    const lines = extractedText.split('\n').filter((l) => l.trim().length > 0)
    const title = lines[0]?.trim() || 'Imported PDF Document'

    return {
      sourceType: 'pdf',
      sourceLocation: filePath,
      title,
      rawText: extractedText,
      sections: [{ heading: 'Full Content', level: 2, content: extractedText }],
      extractedLinks: [],
      citations: [],
    }
  }

  /**
   * Ingest Word .docx document
   */
  async ingestDocx(filePath: string): Promise<IngestedDocument> {
    const pyScript = `
import sys, zipfile, xml.etree.ElementTree as ET
try:
    with zipfile.ZipFile(sys.argv[1]) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paras = []
        for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text]
            if texts:
                paras.append(''.join(texts))
        print('\\n\\n'.join(paras))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`
    const extractedText = execFileSync('python3', ['-c', pyScript, filePath], { encoding: 'utf-8' })
    const paragraphs = extractedText.split('\n\n').filter((p) => p.trim().length > 0)
    const title = paragraphs[0]?.trim() || 'Imported Word Document'

    return {
      sourceType: 'docx',
      sourceLocation: filePath,
      title,
      rawText: extractedText,
      sections: [{ heading: 'Main Content', level: 2, content: extractedText }],
      extractedLinks: [],
      citations: [],
    }
  }

  /**
   * Ingest Web URL with source preservation
   */
  async ingestUrl(url: string): Promise<IngestedDocument> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 blog-publisher/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL ${url} (HTTP ${response.status}: ${response.statusText})`)
    }

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Web Source'

    // Extract links
    const extractedLinks: { text: string; url: string }[] = []
    const linkMatches = html.matchAll(/<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gis)
    for (const match of linkMatches) {
      const cleanText = match[2].replace(/<[^>]+>/g, '').trim()
      if (cleanText && match[1]) {
        extractedLinks.push({ text: cleanText, url: match[1] })
      }
    }

    // Strip scripts, styles, nav, footer, header
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return {
      sourceType: 'url',
      sourceLocation: url,
      title,
      rawText: cleanText,
      sections: [{ heading: 'Extracted Web Content', level: 2, content: cleanText }],
      extractedLinks,
      citations: [url],
    }
  }
}
