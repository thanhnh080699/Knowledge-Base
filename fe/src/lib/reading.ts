import type { Post } from "@/types/post"

// Editorial order from the published CCNA roadmap. Never derive this from dates/IDs.
export const CCNA_SLUGS = [
  "lo-trinh-hoc-ccna",
  "duong-di-goi-tin-tu-may-tinh-ra-internet",
  "ethernet-mac-arp-trong-mang-lan",
  "tcp-udp-cong-dich-vu-va-dau-hieu-loi",
  "ipv4-subnetting-network-host-gateway",
  "vlsm-tong-hop-tuyen-mang-phong-ban",
  "ipv6-ndp-slaac-kiem-tra-ket-noi",
  "cap-interface-trang-thai-loi-ket-noi",
  "cisco-ios-cau-hinh-ban-dau-ssh",
  "switch-hoc-mac-chuyen-tiep-frame",
  "vlan-trunk-8021q-mang-phong-ban",
  "inter-vlan-routing-router-on-a-stick-svi",
  "stp-rapid-pvst-chong-vong-lap",
  "etherchannel-lacp-gop-link-kiem-tra-loi",
  "cdp-lldp-dung-topology-mang",
  "bang-dinh-tuyen-static-default-route",
  "ospf-neighbor-lsdb-spf-dr-bdr",
  "cau-hinh-chan-doan-ospf-single-area",
  "gateway-du-phong-hsrp-vrrp",
  "dhcp-relay-loi-khong-nhan-ip",
  "dns-phan-giai-ten-chan-doan-loi-mang",
  "nat-pat-cau-hinh-chan-doan-internet",
  "acl-standard-extended-kiem-soat-luu-luong",
  "aaa-bao-ve-thiet-bi-layer-2-security",
  "wifi-song-bang-tan-kenh-bao-mat",
  "ap-wlc-client-ket-noi-wlan",
  "van-hanh-cisco-backup-ntp-syslog-snmp",
  "phan-tich-su-co-mang-van-phong",
] as const

// Editorial order from the modernized NGINX SysAdmin roadmap.
export const NGINX_SLUGS = [
  "install-nginx",
  "huong-dan-tao-virtual-host-nginx",
  "install-lets-encrypt-in-nginx",
  "hide-server-nginx-apache-in-respone-header",
  "configuration-http-2-nginx",
  "toi-uu-nen-file-nginx",
  "nginx-ubuntu-20-04-plus-cau-hinh-load-balancing-layer-7-persistence",
  "cac-loai-load-balancing-voi-nginx",
  "nginx-centos-cau-hinh-load-balancing-layer-7-persistence",
  "nginx-ubuntu-20-04-plus-microservices-reverse-proxy-voi-grpc-2026-04-14",
] as const

// Editorial order from the modernized MySQL DBA & High Availability roadmap.
export const MYSQL_SLUGS = [
  "cai-dat-mysql-mariadb-tren-ubuntu",
  "mot-so-mysql-command-line",
  "import-export-mysql",
  "toi-uu-hieu-nang-mysql",
  "mysql-centos-toi-uu-hoa-innodb-buffer-pool-cho-ram-lon",
  "mysql-replicate-master-master",
  "multi-node-mysql",
  "huong-dan-cai-dat-mysql-va-mysql-shell-buoc-dau-de-tao-cluster",
  "pre-checking-va-chuan-bi-he-thong-truoc-khi-tao-mysql-cluster",
  "tao-mysql-cluster-va-tham-gia-group",
  "cai-dat-va-cau-hinh-mysql-router-ket-noi-cluster-an-toan",
  "giam-sat-hieu-suat-mysql-cluster-cac-cong-cu-va-phuong-phap-hieu-qua",
  "cau-hinh-mysql-shell-qua-command-line-cac-lenh-quan-trong-ban-can-biet",
  "khac-phuc-loi-thuong-gap-va-meo-su-dung-mysql-shell-hieu-qua",
] as const

// Editorial order from the modernized Docker Containerization roadmap.
export const DOCKER_SLUGS = [
  "cai-dat-docker-tren-linux",
  "cac-cau-lenh-co-ban-trong-docker",
  "luu-nap-images-docker",
  "docker-file",
  "docker-ubuntu-20-04-plus-xay-dung-image-toi-uu-voi-multi-stage-builds",
  "chia-se-du-lieu-giua-docker-host-va-container",
  "network-trong-docker",
  "docker-plugin-hostnic",
  "docker-compose",
  "giam-sat-container",
] as const

export const LPI_LINUX_SLUGS = [
  "lo-trinh-linux-essentials",
  "chuan-bi-lab-linux-may-ao",
  "linux-essentials-1-1-su-phat-trien-cua-linux-va-cac-he-dieu-hanh-pho-bien",
  "linux-essentials-1-2-cac-ung-dung-ma-nguon-mo-chinh",
  "linux-essentials-1-3-phan-mem-ma-nguon-mo-va-giay-phep",
  "linux-essentials-1-4-ky-nang-cntt-va-lam-viec-tren-linux",
  "linux-essentials-2-1-khai-niem-co-ban-ve-dong-lenh",
  "linux-essentials-2-2-su-dung-dong-lenh-de-nhan-tro-giup",
  "linux-essentials-2-3-su-dung-thu-muc-va-tep-liet-ke",
  "linux-essentials-2-4-tao-di-chuyen-va-xoa-tep",
  "linux-essentials-3-1-luu-tru-tep-tren-dong-lenh",
  "linux-essentials-3-2-tim-kiem-va-trich-xuat-du-lieu-tu-tep",
  "linux-essentials-3-3-bien-lenh-thanh-tap-lenh",
  "linux-essentials-4-1-chon-he-dieu-hanh",
  "linux-essentials-4-2-hieu-phan-cung-cua-may-tinh",
  "linux-essentials-4-3-noi-luu-tru-du-lieu",
  "linux-essentials-4-4-may-tinh-cua-ban-tren-mang",
  "linux-essentials-5-1-bao-mat-co-ban-va-xac-dinh-loai-nguoi-dung",
  "linux-essentials-5-2-tao-nguoi-dung-va-nhom",
  "linux-essentials-5-3-quan-ly-quyen-va-quyen-so-huu-tep",
  "linux-essentials-5-4-cac-thu-muc-va-tep-dac-biet",
  "linux-essentials-thuc-hanh-tong-hop"
] as const

export const LPI_SECURITY_SLUGS = [
  "lo-trinh-security-essentials",
  "security-essentials-021-1-muc-tieu-vai-tro-va-tac-nhan",
  "security-essentials-021-2-danh-gia-va-quan-ly-rui-ro",
  "security-essentials-021-3-pham-tru-dao-duc",
  "security-essentials-022-1-mat-ma-hoc-va-co-so-ha-tang-khoa-cong-khai",
  "security-essentials-022-2-ma-hoa-web",
  "security-essentials-022-3-ma-hoa-email",
  "security-essentials-022-4-ma-hoa-luu-tru-du-lieu",
  "security-essentials-023-1-bao-mat-phan-cung",
  "security-essentials-023-2-bao-mat-ung-dung",
  "security-essentials-023-3-phan-mem-doc-hai",
  "security-essentials-023-4-tinh-kha-dung-cua-du-lieu",
  "security-essentials-024-1-mang-dich-vu-mang-va-internet",
  "security-essentials-024-2-bao-mat-mang-va-internet",
  "security-essentials-024-3-ma-hoa-mang-va-an-danh",
  "security-essentials-025-1-danh-tinh-va-dinh-danh",
  "security-essentials-025-2-bao-mat-thong-tin-va-giao-tiep-an-toan",
  "security-essentials-025-3-bao-ve-quyen-rieng-tu"
] as const

export const LPI_WEB_SLUGS = [
  "lo-trinh-web-development-essentials",
  "web-development-essentials-031-1-khai-niem-co-ban-ve-phat-trien-phan-mem",
  "web-development-essentials-031-2-kien-truc-cua-ung-dung-web",
  "web-development-essentials-031-3-khai-niem-co-ban-ve-http",
  "web-development-essentials-032-1-cau-truc-tai-lieu-html",
  "web-development-essentials-032-2-ngu-nghia-trong-html-va-phan-cap-tai-lieu",
  "web-development-essentials-032-3-tham-chieu-html-va-tai-nguyen-nhung",
  "web-development-essentials-032-4-bieu-mau-html",
  "web-development-essentials-033-1-khai-niem-co-ban-ve-css",
  "web-development-essentials-033-2-bo-chon-css-va-ung-dung-kieu",
  "web-development-essentials-033-3-tao-kieu-css",
  "web-development-essentials-033-4-mo-hinh-va-bo-cuc-hop-trong-css",
  "web-development-essentials-034-1-cu-phap-va-viec-thuc-thi-trong-javascript",
  "web-development-essentials-034-2-cau-truc-du-lieu-javascript",
  "web-development-essentials-034-3-cau-truc-va-chuc-nang-dieu-khien-trong-javascript",
  "web-development-essentials-034-4-thao-tac-javascript-doi-voi-noi-dung-va-kieu-trang-web",
  "web-development-essentials-035-1-khai-niem-co-ban-ve-nodejs",
  "web-development-essentials-035-2-khai-niem-co-ban-ve-nodejs-express",
  "web-development-essentials-035-3-khai-niem-co-ban-ve-sql"
] as const

export const LPI_OPEN_SOURCE_SLUGS = [
  "lo-trinh-open-source-essentials",
  "open-source-essentials-051-1-nhung-nguyen-tac-co-ban-ve-phan-mem",
  "open-source-essentials-051-2-kien-truc-cua-phan-mem",
  "open-source-essentials-051-3-giai-phap-tai-cho-va-dien-toan-dam-may",
  "open-source-essentials-052-1-cac-khai-niem-ve-giay-phep-phan-mem-ma-nguon-mo",
  "open-source-essentials-052-2-giay-phep-phan-mem-copyleft",
  "open-source-essentials-052-3-giay-phep-phan-mem-cho-phep",
  "open-source-essentials-053-1-cac-khai-niem-ve-giay-phep-danh-cho-noi-dung-mo",
  "open-source-essentials-053-2-giay-phep-tai-san-sang-tao-cong-cong-creative-commons",
  "open-source-essentials-053-3-cac-giay-phep-danh-cho-noi-dung-mo-khac",
  "open-source-essentials-054-1-mo-hinh-kinh-doanh-phat-trien-phan-mem",
  "open-source-essentials-054-2-mo-hinh-kinh-doanh-cua-nha-cung-cap-dich-vu",
  "open-source-essentials-054-3-tuan-thu-va-giam-thieu-rui-ro",
  "open-source-essentials-055-1-mo-hinh-phat-trien-phan-mem",
  "open-source-essentials-055-2-quan-ly-san-pham-phat-hanh",
  "open-source-essentials-055-3-quan-ly-cong-dong",
  "open-source-essentials-056-1-cong-cu-phat-trien",
  "open-source-essentials-056-2-quan-ly-ma-nguon",
  "open-source-essentials-056-3-cong-cu-giao-tiep-va-cong-tac"
] as const

export function lessonNumber(post: Pick<Post, "slug">) {
  const webIndex = LPI_WEB_SLUGS.indexOf(post.slug as typeof LPI_WEB_SLUGS[number])
  if (webIndex >= 0) return webIndex + 1

  const openSourceIndex = LPI_OPEN_SOURCE_SLUGS.indexOf(post.slug as typeof LPI_OPEN_SOURCE_SLUGS[number])
  if (openSourceIndex >= 0) return openSourceIndex + 1

  const securityIndex = LPI_SECURITY_SLUGS.indexOf(post.slug as typeof LPI_SECURITY_SLUGS[number])
  if (securityIndex >= 0) return securityIndex + 1

  const lpiIndex = LPI_LINUX_SLUGS.indexOf(post.slug as typeof LPI_LINUX_SLUGS[number])
  if (lpiIndex >= 0) return lpiIndex + 1

  const ccnaIndex = CCNA_SLUGS.indexOf(post.slug as typeof CCNA_SLUGS[number])
  if (ccnaIndex >= 0) return ccnaIndex + 1

  const nginxIndex = NGINX_SLUGS.indexOf(post.slug as typeof NGINX_SLUGS[number])
  if (nginxIndex >= 0) return nginxIndex + 1

  const mysqlIndex = MYSQL_SLUGS.indexOf(post.slug as typeof MYSQL_SLUGS[number])
  if (mysqlIndex >= 0) return mysqlIndex + 1

  const dockerIndex = DOCKER_SLUGS.indexOf(post.slug as typeof DOCKER_SLUGS[number])
  if (dockerIndex >= 0) return dockerIndex + 1

  return undefined
}

export function displayPostTitle(post: Pick<Post, "slug" | "title">) {
  const number = lessonNumber(post)
  if (LPI_WEB_SLUGS.some(slug => slug === post.slug)) {
    const title = post.title.replace(/^(?:Web Development Essentials\s+(?:\d+\.\d+|EP\s*\d+)\s*:\s*|EP\s*\d+\s*:\s*)/i, "")
    return `Web Development Essentials EP ${number}: ${title}`
  }
  if (LPI_OPEN_SOURCE_SLUGS.some(slug => slug === post.slug)) {
    const title = post.title.replace(/^(?:Open Source Essentials\s+(?:\d+\.\d+|EP\s*\d+)\s*:\s*|EP\s*\d+\s*:\s*)/i, "")
    return `Open Source Essentials EP ${number}: ${title}`
  }
  if (LPI_SECURITY_SLUGS.some(slug => slug === post.slug)) {
    const title = post.title.replace(/^(?:Security Essentials\s+(?:\d+\.\d+|EP\s*\d+)\s*:\s*|EP\s*\d+\s*:\s*)/i, "")
    return `Security Essentials EP ${number}: ${title}`
  }
  if (LPI_LINUX_SLUGS.some(slug => slug === post.slug)) {
    const title = post.title.replace(/^(?:Linux Essentials\s+(?:\d+\.\d+|EP\s*\d+)\s*:\s*|EP\s*\d+\s*:\s*)/i, "")
    return `Linux Essentials EP ${number}: ${title}`
  }
  return number ? `Bài ${number}: ${post.title}` : post.title
}

export function postHref(post: Pick<Post, "slug" | "category">) {
  return `/docs/${post.category?.slug ?? "general"}/${post.slug}`
}

export function sortLessons(posts: Post[]) {
  return [...posts].sort((a, b) => (lessonNumber(a) ?? Infinity) - (lessonNumber(b) ?? Infinity))
}

function getRoadmapSlugs(slug: string): readonly string[] | undefined {
  if (LPI_WEB_SLUGS.some(lessonSlug => lessonSlug === slug)) return LPI_WEB_SLUGS
  if (LPI_OPEN_SOURCE_SLUGS.some(lessonSlug => lessonSlug === slug)) return LPI_OPEN_SOURCE_SLUGS
  if (LPI_SECURITY_SLUGS.some(lessonSlug => lessonSlug === slug)) return LPI_SECURITY_SLUGS
  if (LPI_LINUX_SLUGS.some(lessonSlug => lessonSlug === slug)) return LPI_LINUX_SLUGS
  if (CCNA_SLUGS.some(lessonSlug => lessonSlug === slug)) return CCNA_SLUGS
  if (NGINX_SLUGS.some(lessonSlug => lessonSlug === slug)) return NGINX_SLUGS
  if (MYSQL_SLUGS.some(lessonSlug => lessonSlug === slug)) return MYSQL_SLUGS
  if (DOCKER_SLUGS.some(lessonSlug => lessonSlug === slug)) return DOCKER_SLUGS
  return undefined
}

export function readingSuggestions(post: Post, candidates: Post[]) {
  const published = [...new Map(candidates.filter(p => p.status === "PUBLISHED").map(p => [p.id, p])).values()]
  const roadmap = getRoadmapSlugs(post.slug)
  const index = roadmap ? roadmap.indexOf(post.slug) : -1
  const previous = roadmap && index > 0 ? published.find(p => p.slug === roadmap[index - 1]) : undefined
  const next = roadmap && index >= 0 ? published.find(p => p.slug === roadmap[index + 1]) : undefined
  const excluded = new Set([post.id, previous?.id, next?.id])
  const tags = new Set(post.tags?.map(t => t.id) ?? [])
  const score = (p: Post) => p.tags?.filter(t => tags.has(t.id)).length ?? 0
  const categoryId = post.categoryId ?? post.category?.id
  const related = published.filter(p => !excluded.has(p.id) && categoryId != null && (p.categoryId ?? p.category?.id) === categoryId)
    .sort((a, b) => score(b) - score(a) || Date.parse(b.publishedAt ?? "1970-01-01") - Date.parse(a.publishedAt ?? "1970-01-01") || a.id - b.id)
    .slice(0, 4)
  return { previous, next, related }
}

export type ReadingVisit = { id: number; visitedAt: number }
export const READING_HISTORY_KEY = "docs_reading_history_v1"

export function recordReadingVisit(storage: Pick<Storage, "getItem" | "setItem">, id: number, visitedAt = Date.now()) {
  try {
    const visits = parseReadingHistory(storage.getItem(READING_HISTORY_KEY)).filter(v => v.id !== id)
    storage.setItem(READING_HISTORY_KEY, JSON.stringify([{ id, visitedAt }, ...visits].slice(0, 500)))
    return visits
  } catch {
    return []
  }
}

export function parseReadingHistory(raw: string | null): ReadingVisit[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]")
    if (!Array.isArray(value)) return []
    const seen = new Set<number>()
    return value.filter((item): item is ReadingVisit => {
      if (!item || !Number.isInteger(item.id) || item.id <= 0 || !Number.isFinite(item.visitedAt)) return false
      return true
    }).sort((a, b) => b.visitedAt - a.visitedAt).filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    }).slice(0, 500)
  } catch {
    return []
  }
}
