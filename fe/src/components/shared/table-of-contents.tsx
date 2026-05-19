export interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <aside className="hidden xl:block xl:sticky xl:top-20">
      <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">Trong trang này</p>
        <nav className="mt-4 grid gap-2" aria-label="Mục lục">
          {items.length ? items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={`text-sm text-[var(--color-body)] hover:text-[var(--color-ink)] ${item.level === 3 ? "pl-3" : ""}`}>
              {item.text}
            </a>
          )) : <span className="text-sm text-[var(--color-muted)]">Chưa có đề mục</span>}
        </nav>
      </div>
    </aside>
  )
}
