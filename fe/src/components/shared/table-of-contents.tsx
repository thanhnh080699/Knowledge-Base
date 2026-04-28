export interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <aside className="hidden xl:block xl:sticky xl:top-20">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Trong trang này</p>
        <nav className="mt-4 grid gap-2" aria-label="Mục lục">
          {items.length ? items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={`text-sm text-slate-600 hover:text-blue-600 ${item.level === 3 ? "pl-3" : ""}`}>
              {item.text}
            </a>
          )) : <span className="text-sm text-slate-500">Chưa có đề mục</span>}
        </nav>
      </div>
    </aside>
  )
}
