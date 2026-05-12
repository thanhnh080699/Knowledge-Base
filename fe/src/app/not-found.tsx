import Image from "next/image"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="bg-white">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] items-center gap-8 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-10 lg:gap-16">
        <div className="flex justify-center md:justify-end animate-in fade-in slide-in-from-left-8 duration-700">
          <Image
            src="/images/errors/404-mascot.png"
            alt="Surprised green 404 mascot"
            width={420}
            height={420}
            priority
            className="h-auto w-full max-w-[260px] drop-shadow-[0_18px_18px_rgba(15,23,42,0.12)] sm:max-w-[340px] md:max-w-[390px]"
          />
        </div>

        <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-6 inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            Lỗi 404
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-6xl lg:text-[72px]">
            OOPS! TRANG<br />
            <span className="text-blue-600">KHÔNG TỒN TẠI.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-slate-600">
            Có vẻ như bạn đã đi nhầm cửa rồi. Trang bạn đang tìm kiếm không thể được tìm thấy hoặc đã được di chuyển sang một địa chỉ khác.
          </p>
          <div className="mt-10">
            <Button
              href="/"
              variant="primary"
              className="h-12 min-w-[200px] px-8 text-base font-bold shadow-sm"
            >
              <Home size={20} className="mr-2" aria-hidden />
              Về trang chủ
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
