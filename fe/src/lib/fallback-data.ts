import type { Category } from "@/types/category"
import type { Post } from "@/types/post"
import type { Project } from "@/types/project"
import type { Tag } from "@/types/tag"

export const fallbackCategories: Category[] = [
  { id: 1, name: "Systems Administration", slug: "sysadmin", parentId: null, description: "Quản trị máy chủ, cấu hình mạng, bảo mật và vận hành hệ thống" },
  { id: 2, name: "DevOps", slug: "devops", parentId: null, description: "CI/CD, Docker, Kubernetes, monitoring và triển khai tự động" },
  { id: 3, name: "Development", slug: "development", parentId: null, description: "Backend, frontend, kiến trúc ứng dụng và best practices" },
  { id: 4, name: "HelpDesk", slug: "helpdesk", parentId: null, description: "Ghi chú xử lý sự cố và hỗ trợ kỹ thuật người dùng" }
]

export const fallbackTags: Tag[] = [
  { id: 1, name: "Linux", slug: "linux", description: null },
  { id: 2, name: "Docker", slug: "docker", description: null },
  { id: 3, name: "Next.js", slug: "nextjs", description: null },
  { id: 4, name: "Security", slug: "security", description: null }
]

export const fallbackPosts: Post[] = [
  {
    id: 1,
    title: "Checklist hardening VPS cho production",
    slug: "checklist-hardening-vps-production",
    content: "## Tổng quan\nCác bước cơ bản để đưa VPS lên production.\n\n## Bảo mật SSH\nTắt đăng nhập bằng mật khẩu, đổi port hợp lý và giới hạn user.\n\n## Firewall\nChỉ mở các port cần thiết và ghi log truy cập bất thường.",
    excerpt: "Checklist ngắn gọn cho SSH, firewall, update, backup và monitoring trên VPS production.",
    status: "PUBLISHED",
    category: fallbackCategories[0],
    tags: [fallbackTags[0], fallbackTags[3]],
    publishedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Docker Compose cho stack web nhỏ",
    slug: "docker-compose-cho-stack-web-nho",
    content: "## Kiến trúc\nTách app, database và reverse proxy thành từng service rõ ràng.\n\n## Volume\nĐặt tên volume dễ hiểu để backup thuận tiện hơn.\n\n## Deploy\nDùng biến môi trường riêng cho production.",
    excerpt: "Cách tổ chức Docker Compose gọn, dễ backup và dễ vận hành cho các website nhỏ.",
    status: "PUBLISHED",
    category: fallbackCategories[1],
    tags: [fallbackTags[1]],
    publishedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Next.js App Router cho website tài liệu",
    slug: "nextjs-app-router-cho-website-tai-lieu",
    content: "## Routing\nDùng nested route cho khu vực tài liệu.\n\n## ISR\nĐặt revalidate cho nội dung tài liệu để cân bằng tốc độ và độ mới.\n\n## SEO\nSinh metadata động từ API.",
    excerpt: "Ghi chú triển khai App Router, ISR và metadata động cho website tài liệu kỹ thuật.",
    status: "PUBLISHED",
    category: fallbackCategories[2],
    tags: [fallbackTags[2]],
    publishedAt: new Date().toISOString()
  }
]

export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "thanhnh.id.vn CMS",
    slug: "thanhnh-cms",
    description: "Admin panel quản trị bài viết, danh mục, media và dự án.",
    content: "## Phạm vi triển khai\nXây dựng dashboard quản trị nội dung theo workflow CMS: bài viết, phân loại, media, project và cấu hình hệ thống.\n\n## Kết quả\nTối ưu thao tác biên tập, upload ảnh qua CDN nội bộ và kết nối API phân quyền.",
    techStack: ["Next.js", "React Query", "Zustand"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true,
    status: "PUBLISHED"
  },
  {
    id: 2,
    title: "AdonisJS Content API",
    slug: "adonisjs-content-api",
    description: "REST API cho content, portfolio, contact va sitemap.",
    content: "## Phạm vi triển khai\nThiết kế REST API cho content, taxonomy, portfolio, service, contact và sitemap.\n\n## Kết quả\nChuẩn hóa validator, ACL, migration và media path để FE/CMS dùng chung một contract.",
    techStack: ["AdonisJS", "MariaDB", "Lucid"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true,
    status: "PUBLISHED"
  },
  {
    id: 3,
    title: "Go CDN",
    slug: "go-cdn-service",
    description: "Module upload, resize ảnh và phân phối media qua CDN nội bộ.",
    content: "## Phạm vi triển khai\nXây dựng service upload, quản lý folder, serve file và resize ảnh on-the-fly.\n\n## Kết quả\nCMS upload ảnh theo module, FE hiển thị bằng URL CDN tuyệt đối và hỗ trợ biến thể ảnh WebP.",
    techStack: ["Go", "Gin", "Image"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true,
    status: "PUBLISHED"
  }
]
