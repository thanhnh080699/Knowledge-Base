"use client"

import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { CopyButton } from "./copy-button"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { hasHtmlContent, normalizeHtmlContent, slugifyHeading } from "@/lib/content"

export function PostContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // For HTML content, we manually add copy buttons to pre tags
    const pres = contentRef.current.querySelectorAll("pre")
    pres.forEach((pre) => {
      if (pre.querySelector(".copy-button-wrapper")) return
      
      pre.style.position = "relative"
      pre.classList.add("group")
      
      const buttonContainer = document.createElement("div")
      buttonContainer.className = "copy-button-wrapper absolute right-2 top-2 z-10"
      
      // We can't easily mount a React component here without more complexity, 
      // but we can use a simple button and event listener for HTML blocks.
      const button = document.createElement("button")
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
      button.className = "rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
      button.title = "Copy code"
      
      button.onclick = async () => {
        const code = pre.querySelector("code")?.innerText || pre.innerText
        await navigator.clipboard.writeText(code)
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>`
        setTimeout(() => {
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
        }, 2000)
      }
      
      buttonContainer.appendChild(button)
      pre.appendChild(buttonContainer)
    })
  }, [content])

  if (hasHtmlContent(content)) {
    return (
      <div
        ref={contentRef}
        className="doc-content prose mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(content) }}
      />
    )
  }

  return (
    <div ref={contentRef} className="doc-content prose mt-8 max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
          h2: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugifyHeading(String(children))}>{children}</h3>,
          pre: ({ children }) => {
            // Extract text content for the copy button
            const codeElement = children as { props?: { children?: string | string[] } }
            const codeContent = codeElement.props?.children || ""
            return (
              <div className="relative group">
                <CopyButton text={String(codeContent).replace(/\n$/, "")} />
                <pre className="!mt-0">{children}</pre>
              </div>
            )
          },
          img: ({ src, alt, ...props }) => {
            if (!src || typeof src !== 'string') return null
            return (
              <span className="block my-8">
                <img 
                  src={absoluteCdnUrl(src)} 
                  alt={alt ?? ""} 
                  {...props} 
                  className="mx-auto block rounded-xl border border-slate-200 shadow-sm" 
                />
                {alt && (
                  <span className="mt-3 block text-center text-sm italic text-slate-500">
                    {alt}
                  </span>
                )}
              </span>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
