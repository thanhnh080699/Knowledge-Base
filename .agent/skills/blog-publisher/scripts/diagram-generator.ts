/**
 * Deterministic Diagram & Visual Generator
 *
 * Capabilities:
 * - Generates crisp, modern 1600x900 / 1600x1200 technical SVGs (diagnostic flowcharts, architecture diagrams)
 * - Renders SVG -> PNG via macOS built-in `sips`
 * - Converts PNG -> optimized WebP via `/opt/homebrew/bin/cwebp`
 * - Formats Vietnamese labels, step badges, directional arrows, and technical caveats.
 */

import { execFileSync } from 'node:child_process'
import { writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'

export interface FlowchartStep {
  check: string
  label: string
  outcome: string
}

export interface FlowchartOptions {
  title: string
  subtitle?: string
  categoryBadge?: string
  steps: FlowchartStep[]
  footerNote?: string
  width?: number
  height?: number
  outputPath?: string // output .webp path
}

export class DiagramGenerator {
  /**
   * Escape XML entities
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Wrap text lines for SVG rendering
   */
  private wrapText(text: string, maxCharsPerLine: number = 38): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim()
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines
  }

  /**
   * Generate SVG code for a diagnostic flowchart
   */
  generateFlowchartSvg(options: FlowchartOptions): string {
    const width = options.width || 1600
    const stepCount = options.steps.length
    const height = options.height || Math.max(1000, 320 + stepCount * 190 + 120)

    const badge = this.escapeXml(options.categoryBadge || 'HELP DESK / SƠ ĐỒ CHẨN ĐOÁN')
    const title = this.escapeXml(options.title)
    const subtitle = this.escapeXml(options.subtitle || 'Thực hiện tuần tự từ trên xuống dưới cho đến khi khoanh vùng xong sự cố.')
    const footerNote = this.escapeXml(options.footerNote || 'Lưu ý: Chỉ thực hiện bước có nguy cơ ảnh hưởng sau khi đã sao lưu và thông báo cho người dùng.')

    let stepsSvg = ''
    const startY = 240
    const rowHeight = 160
    const rowGap = 35

    options.steps.forEach((step, i) => {
      const y = startY + i * (rowHeight + rowGap)
      const num = i + 1

      // Left Box (Action/Check)
      const checkLines = this.wrapText(step.check, 32)
      const checkTspans = checkLines
        .map((line, li) => `<tspan x="160" dy="${li === 0 ? '0' : '1.4em'}">${this.escapeXml(line)}</tspan>`)
        .join('')

      // Middle label on arrow
      const labelLines = this.wrapText(step.label, 18)
      const labelTspans = labelLines
        .map((line, li) => `<tspan x="915" dy="${li === 0 ? '0' : '1.3em'}">${this.escapeXml(line)}</tspan>`)
        .join('')

      // Right Box (Outcome/Fix)
      const outcomeLines = this.wrapText(step.outcome, 28)
      const outcomeTspans = outcomeLines
        .map((line, li) => `<tspan x="1055" dy="${li === 0 ? '0' : '1.4em'}">${this.escapeXml(line)}</tspan>`)
        .join('')

      // Vertical down arrow connecting left boxes
      const verticalArrow =
        i < stepCount - 1
          ? `
        <line x1="440" y1="${y + rowHeight}" x2="440" y2="${y + rowHeight + rowGap - 8}" stroke="#327e80" stroke-width="4" stroke-dasharray="6,4" />
        <polygon points="434,${y + rowHeight + rowGap - 8} 446,${y + rowHeight + rowGap - 8} 440,${y + rowHeight + rowGap}" fill="#327e80" />
      `
          : ''

      stepsSvg += `
      <!-- Step ${num} -->
      <g class="step-row" id="step-${num}">
        <!-- Left Check Box -->
        <rect x="70" y="${y}" width="740" height="${rowHeight}" rx="20" fill="#ffffff" stroke="#8aafb0" stroke-width="2.5" />
        <circle cx="115" cy="${y + 50}" r="26" fill="#216c71" />
        <text x="115" y="${y + 59}" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${num}</text>
        
        <text x="160" y="${y + 45}" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#14363b">
          ${checkTspans}
        </text>

        <!-- Connecting Horizontal Arrow -->
        <line x1="810" y1="${y + rowHeight / 2}" x2="1020" y2="${y + rowHeight / 2}" stroke="#327e80" stroke-width="4" />
        <polygon points="1016,${y + rowHeight / 2 - 8} 1016,${y + rowHeight / 2 + 8} 1028,${y + rowHeight / 2}" fill="#327e80" />
        
        <!-- Label above arrow -->
        <text x="915" y="${y + rowHeight / 2 - 18}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#446164" text-anchor="middle">
          ${labelTspans}
        </text>

        <!-- Right Outcome Box -->
        <rect x="1030" y="${y}" width="500" height="${rowHeight}" rx="20" fill="#e0eeea" stroke="#b2cfc8" stroke-width="2" />
        <text x="1055" y="${y + 48}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#14363b">
          ${outcomeTspans}
        </text>

        ${verticalArrow}
      </g>
      `
    })

    const footerY = startY + stepCount * (rowHeight + rowGap) + 40

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .bg { fill: #f4f6f0; }
      .badge { font-family: system-ui, -apple-system, sans-serif; font-size: 20px; font-weight: 700; fill: #327e80; letter-spacing: 1.5px; }
      .title { font-family: system-ui, -apple-system, sans-serif; font-size: 40px; font-weight: 800; fill: #14363b; }
      .subtitle { font-family: system-ui, -apple-system, sans-serif; font-size: 22px; font-weight: 400; fill: #526a6c; }
      .footer { font-family: system-ui, -apple-system, sans-serif; font-size: 19px; font-style: italic; fill: #526a6c; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" class="bg" />

  <!-- Header -->
  <text x="70" y="70" class="badge">${badge}</text>
  <text x="70" y="125" class="title">${title}</text>
  <text x="70" y="170" class="subtitle">${subtitle}</text>

  <!-- Steps -->
  ${stepsSvg}

  <!-- Footer Note -->
  <rect x="70" y="${footerY}" width="1460" height="70" rx="14" fill="#ffffff" stroke="#c0d4cc" stroke-width="1.5" />
  <text x="95" y="${footerY + 42}" class="footer">${footerNote}</text>
</svg>`
  }

  /**
   * Render SVG string to PNG file using macOS sips
   */
  async renderSvgToPng(svgContent: string, outputPngPath: string): Promise<string> {
    const tempSvg = `${outputPngPath}.temp.svg`
    await writeFile(tempSvg, svgContent, 'utf-8')

    try {
      execFileSync('sips', ['-s', 'format', 'png', tempSvg, '--out', outputPngPath], {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      return outputPngPath
    } finally {
      await unlink(tempSvg).catch(() => {})
    }
  }

  /**
   * Convert PNG to WebP using cwebp
   */
  async convertPngToWebp(pngPath: string, outputWebpPath: string, quality: number = 88): Promise<string> {
    const cwebpBinary = '/opt/homebrew/bin/cwebp'
    execFileSync(cwebpBinary, ['-q', String(quality), pngPath, '-o', outputWebpPath], {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    return outputWebpPath
  }

  /**
   * End-to-end: generate flowchart SVG and export directly to WebP
   */
  async renderFlowchartToWebp(options: FlowchartOptions, outputWebpPath: string): Promise<string> {
    const svg = this.generateFlowchartSvg(options)
    const tempPng = `${outputWebpPath}.temp.png`

    try {
      await this.renderSvgToPng(svg, tempPng)
      await this.convertPngToWebp(tempPng, outputWebpPath)
      return outputWebpPath
    } finally {
      await unlink(tempPng).catch(() => {})
    }
  }
}
