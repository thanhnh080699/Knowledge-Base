export const revalidate = false

const stylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
          body {
            margin: 0;
            padding: 10px 32px 32px;
            background: #fff;
            color: #333;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.4;
          }
          h1 {
            margin: 0 0 14px;
            color: #555;
            font-size: 27px;
            line-height: 1.25;
          }
          p {
            margin: 0 0 14px;
            font-size: 13px;
          }
          a {
            color: #e00;
            font-weight: 700;
            text-decoration: none;
          }
          table {
            width: 1000px;
            max-width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th {
            padding: 1px 0;
            border-bottom: 1px solid #111;
            color: #555;
            font-weight: 700;
            text-align: left;
          }
          td {
            padding: 1px 0;
            color: #111;
            vertical-align: top;
            word-break: break-all;
          }
          tr:nth-child(even) td {
            background: #eee;
          }
          .url {
            width: 80%;
          }
          .freq {
            width: 12%;
          }
          .priority {
            width: 8%;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML Sitemap, meant for consumption by search engines.</p>
        <p>You can find more information about XML sitemaps on <a href="https://www.sitemaps.org/">sitemaps.org</a>.</p>
        <p>This XML Sitemap file contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URL.</p>
        <table>
          <thead>
            <tr>
              <th class="url">URL</th>
              <th class="freq">Change Freq</th>
              <th class="priority">Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td class="url">
                  <xsl:value-of select="sitemap:loc"/>
                </td>
                <td class="freq">
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
                <td class="priority">
                  <xsl:value-of select="sitemap:priority"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`

export async function GET() {
  return new Response(stylesheet, {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
