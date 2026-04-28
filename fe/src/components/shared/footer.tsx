import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div>
          <p className="font-bold text-slate-950">thanhnh.id.vn</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Tài liệu kỹ thuật, portfolio cá nhân và dịch vụ lập trình web cho hệ thống vận hành thực tế.
          </p>
        </div>
        <nav aria-label="Liên kết tài liệu" className="grid gap-2 text-sm text-slate-600">
          <Link className="hover:text-blue-600" href="/docs">Tài liệu</Link>
          <Link className="hover:text-blue-600" href="/projects">Dự án</Link>
          <Link className="hover:text-blue-600" href="/services">Dịch vụ</Link>
        </nav>
        <nav aria-label="Liên kết liên hệ" className="grid gap-2 text-sm text-slate-600">
          <Link className="hover:text-blue-600" href="/portfolio">Portfolio</Link>
          <Link className="hover:text-blue-600" href="/contact">Liên hệ</Link>
        </nav>
      </div>
    </footer>
  )
}
