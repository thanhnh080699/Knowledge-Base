import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Braces, GitFork, Layers, Search, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CdnImage } from "@/components/shared/cdn-image"
import { StoryWorkspace } from "@/components/shared/story-workspace"
import { StoryScrollEffects } from "@/components/shared/story-scroll-effects"
import { PageMascot } from "@/components/shared/page-mascot"
import { getPosts } from "@/lib/api"
import { displayPostTitle } from "@/lib/reading"
import "./home.css"
import "./story-motion.css"
import "./page-mascot.css"

export const revalidate = 60
const description = "Kho tài liệu IT tiếng Việt, công cụ tiện ích và bài giới thiệu dự án mã nguồn mở cho học tập và công việc."
export const metadata: Metadata = {
  title: "Tài liệu IT, Tools và Top Repos",
  description,
  alternates: { canonical: "https://thanhnh.id.vn" },
  openGraph: { title: "Knowledge Base | Tài liệu IT · Tools · Top Repos", description, url: "https://thanhnh.id.vn" },
}

const paths = [
  { number: "01", title: "Xây nền tảng, hiểu cách mọi thứ hoạt động.", text: "Bắt đầu từ mạng máy tính, Linux và các nguyên tắc bảo mật.", links: [["CCNA", "ccna"], ["Linux Essentials", "lpi-linux-essentials"], ["Security Essentials", "lpi-security-essentials"]] },
  { number: "02", title: "Tự tay xây dựng và thử nghiệm.", text: "Đi từ cách web hoạt động đến ứng dụng PHP và kiến thức mã nguồn mở.", links: [["Web Essentials", "lpi-web-development-essentials"], ["PHP", "php"], ["Open Source", "lpi-open-source-essentials"]] },
  { number: "03", title: "Mang kiến thức vào công việc.", text: "Tra cứu khi cấu hình dịch vụ, vận hành hệ thống hoặc hỗ trợ người dùng.", links: [["Docker", "docker"], ["NGINX", "nginx-3"], ["MySQL", "mysql"], ["Monitoring", "monitoring"], ["CEH", "ceh"], ["Help Desk", "help-desk"]] },
]
const tools = [
  ["JSON Formatter", "json-formatter"],
  ["IPv4 Subnet Calculator", "ipv4-subnet-calculator"],
  ["Cron Builder", "cron-builder"],
  ["Base64", "base64-encoder-decoder"],
  ["Timestamp Converter", "timestamp-converter"],
  ["Text Diff", "text-diff"],
]
const date = (value: string) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value))

export default async function HomePage() {
  const response = await getPosts({ category: "top-repos", limit: 12, sort: "newest" }, { signal: AbortSignal.timeout(8000) })
  const articles = response.data
    .filter(post => post.status === "PUBLISHED" && post.category?.slug === "top-repos")
    .sort((a, b) => (Date.parse(b.publishedAt ?? "") || 0) - (Date.parse(a.publishedAt ?? "") || 0) || b.id - a.id)
    .slice(0, 3)
  const [featured, ...more] = articles

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Knowledge Base", url: "https://thanhnh.id.vn", description }) }} />
    <main id="main-content" tabIndex={-1} className="home-story outline-none">
      <section className="story-hero" aria-labelledby="home-title">
        <Image className="story-hero-image" src="/images/home-story-hero.webp" alt="" fill preload fetchPriority="high" sizes="100vw" />
        <div className="story-hero-shade" />
        <div className="story-container story-hero-content">
          <h1 id="home-title">Hiểu điều đang học.<br /><span>Làm được điều đang cần.</span></h1>
          <p className="story-hero-lead">Một nơi để học kiến thức IT, tìm công cụ cho công việc và khám phá những dự án mã nguồn mở hữu ích.</p>
          <div className="story-hero-actions"><Button href="#cau-chuyen">Bắt đầu khám phá <ArrowDown size={16} aria-hidden /></Button><Link href="/docs">Tìm tài liệu <ArrowUpRight size={16} aria-hidden /></Link></div>
          <nav className="story-hero-nav" aria-label="Ba phần chính của website">
            <a href="#tai-lieu"><BookOpen size={16} aria-hidden />Tài liệu IT</a><a href="#cong-cu"><Wrench size={16} aria-hidden />Tools</a><a href="#top-repos"><GitFork size={16} aria-hidden />Top Repos</a>
          </nav>
        </div>
        <PageMascot />
      </section>

      <section id="cau-chuyen" className="story-intro story-container" aria-labelledby="intro-title">
        <h2 id="intro-title">Có lúc bạn cần hiểu một khái niệm.<br />Có lúc bạn cần giải quyết một việc.</h2>
        <p>Một cấu hình chưa rõ, một đoạn dữ liệu khó đọc, hay một dự án bạn muốn thử. Knowledge Base kết nối tài liệu, công cụ và bài giới thiệu công nghệ để bạn có nơi bắt đầu và một bước tiếp theo.</p>
      </section>
      <StoryWorkspace />
      <StoryScrollEffects />

      <section id="tai-lieu" className="story-chapter story-container" aria-labelledby="docs-title">
        <div className="story-split">
          <div className="story-copy">
            <h2 id="docs-title">Trước khi tìm câu lệnh,<br /><em>hãy hiểu điều đang xảy ra.</em></h2>
            <p>Vì sao máy cùng mạng vẫn không kết nối được? Quyền tệp Linux ảnh hưởng đến ứng dụng thế nào? Một truy vấn PHP đi đến cơ sở dữ liệu ra sao?</p>
            <p>Các bộ tài liệu tiếng Việt giúp bạn đi từ khái niệm đến ví dụ và thực hành. Bạn có thể học theo một lộ trình, hoặc quay lại một chủ đề khi cần tra cứu.</p>
            <Button href="/docs">Tìm bộ tài liệu của bạn <ArrowRight size={16} aria-hidden /></Button>
          </div>
          <figure className="story-doc-visual">
            <div className="story-doc-image"><Image src="/images/home-story-docs.webp" alt="Minh họa sổ ghi chép, sơ đồ mạng và hệ thống máy chủ" fill sizes="(min-width: 1264px) 564px, (min-width: 900px) 46vw, calc(100vw - 40px)" /></div>
          </figure>
        </div>
        <div className="story-reading-path">
          <div>{paths.map(path => <article className="story-path-row" key={path.number}><span className="story-path-number">{path.number}</span><div><h3>{path.title}</h3><p>{path.text}</p><div className="story-topic-links">{path.links.map(([label, slug]) => <Link href={`/docs/categories/${slug}`} key={slug}>{label}<ArrowUpRight size={12} aria-hidden /></Link>)}</div></div></article>)}</div>
        </div>
        <form className="story-search" action="/docs"><Search size={19} aria-hidden /><label htmlFor="story-search" className="sr-only">Tìm tài liệu IT</label><input id="story-search" name="q" type="search" placeholder="Đã có câu hỏi? Tìm VLAN, quyền Linux, PHP PDO…" /><button type="submit">Tìm tài liệu <ArrowRight size={15} aria-hidden /></button></form>
      </section>


      <section id="cong-cu" className="story-tools" aria-labelledby="tools-title">
        <div className="story-container story-tools-content">
          <div className="tools-introduction">
            <h2 id="tools-title">Bớt thao tác lặp lại.<br /><em>Thêm thời gian cho vấn đề chính.</em></h2>
            <div><p>Một đoạn JSON khó đọc, một subnet cần tính hay timestamp cần đối chiếu. Chọn công cụ phù hợp, xử lý phần việc đó rồi quay lại vấn đề chính.</p><Button href="/tools">Chọn công cụ bạn cần <ArrowRight size={16} aria-hidden /></Button></div>
          </div>
          <div className="story-tool-demo" data-tools-demo aria-label="Ví dụ minh họa công cụ định dạng JSON">
            <div className="story-demo-bar"><span><Braces size={18} aria-hidden />JSON Formatter</span><Link href="/tools/json-formatter">Thử với dữ liệu của bạn <ArrowUpRight size={16} aria-hidden /></Link></div>
            <div className="tools-workbench">
              <div className="story-demo-input"><span>Đầu vào</span><code>{'{"service":"knowledge-base","topics":["IT","Tools","Repos"],"ready":true}'}</code><p>Dữ liệu vẫn đủ.<br />Chỉ cần một cách trình bày rõ hơn.</p></div>
              <div className="story-demo-arrow"><div className="tools-transfer" aria-hidden="true"><span /><i /><ArrowRight size={20} /></div></div>
              <pre className="tools-output"><span className="tools-scan" aria-hidden="true" /><code>{JSON.stringify({ service: "knowledge-base", topics: ["IT", "Tools", "Repos"], ready: true }, null, 2).split("\n").map((line, index) => <span className={`tools-output-line tools-line-${index}`} key={index}>{line}</span>)}</code></pre>
            </div>
          </div>
          <div className="story-tool-links">{tools.map(([name, slug]) => <Link href={`/tools/${slug}`} key={slug}>{name}<ArrowUpRight size={13} aria-hidden /></Link>)}</div>
        </div>
      </section>

      <section id="top-repos" className="story-container story-chapter story-repos" aria-labelledby="repos-title">
        <div className="story-repos-intro"><div className="story-copy"><h2 id="repos-title">Từ một repo hay,<br /><em>đến ý tưởng tiếp theo của bạn.</em></h2></div><div className="story-repos-description"><p>Một cái tên trên GitHub chưa nói hết dự án có thể làm gì. Các bài Top Repos giới thiệu công dụng, cách sử dụng và những điểm cần cân nhắc để bạn có thêm cơ sở trước khi tìm hiểu sâu.</p><Button href="/repos" variant="outline">Khám phá Top Repos <ArrowRight size={16} aria-hidden /></Button></div></div>
        {featured ? <div className="story-editorial">
          <Link className="story-featured" href={`/docs/top-repos/${featured.slug}`}><div className="story-featured-image">{featured.coverImage ? <CdnImage src={featured.coverImage} alt="" fill sizes="(min-width: 900px) 650px, 100vw" className="object-cover" /> : <Layers size={48} aria-hidden />}</div><div className="story-featured-copy">{featured.publishedAt && <p className="story-date">{date(featured.publishedAt)}</p>}<h3>{displayPostTitle(featured)}</h3>{featured.excerpt && <p>{featured.excerpt}</p>}<span className="story-text-link">Tìm hiểu dự án <ArrowRight size={16} aria-hidden /></span></div></Link>
          <div className="story-more">{more.map((post, index) => <Link className="story-more-article" href={`/docs/top-repos/${post.slug}`} key={post.id}><span className="story-path-number">0{index + 2}</span><div>{post.publishedAt && <p className="story-date">{date(post.publishedAt)}</p>}<h3>{displayPostTitle(post)}</h3>{post.excerpt && <p className="story-clamp">{post.excerpt}</p>}<span className="story-text-link">Đọc bài giới thiệu <ArrowUpRight size={15} aria-hidden /></span></div></Link>)}<Link className="story-all-repos" href="/repos">Xem tất cả bài Top Repos <ArrowRight size={17} aria-hidden /></Link></div>
        </div> : <p className="story-empty">Các bài giới thiệu đang tạm thời chưa tải được. <Link href="/repos">Mở Top Repos →</Link></p>}
      </section>

      <section className="story-ending"><div className="story-container"><h2>Hôm nay bạn muốn<br /><em>bắt đầu từ đâu?</em></h2><div className="story-ending-links"><Link href="/docs">Đọc một tài liệu <ArrowUpRight size={18} aria-hidden /></Link><Link href="/tools">Mở một công cụ <ArrowUpRight size={18} aria-hidden /></Link><Link href="/repos">Khám phá một dự án <ArrowUpRight size={18} aria-hidden /></Link></div><div className="story-author"><p>Knowledge Base được Nguyễn Huy Thành biên soạn và duy trì.</p><div><Link href="/portfolio">Về tác giả</Link><Link href="/projects">Dự án</Link><Link href="/contact">Góp ý</Link></div></div></div></section>
    </main>
  </>
}
