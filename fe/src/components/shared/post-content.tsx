import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { hasHtmlContent, normalizeHtmlContent, slugifyHeading } from "@/lib/content"

export function PostContent({ content }: { content: string }) {
  if (hasHtmlContent(content)) {
    return (
      <div
        className="doc-content prose mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(content) }}
      />
    )
  }

  return (
    <div className="doc-content prose mt-8 max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
          h2: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugifyHeading(String(children))}>{children}</h3>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
