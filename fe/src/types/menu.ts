export type MenuItemTarget = "_self" | "_blank"

export interface MenuItem {
  id: number
  menuId: number
  parentId: number | null
  title: string
  url: string | null
  type: "CUSTOM" | "PAGE" | "POST" | "CATEGORY" | "TAG"
  referenceId: number | null
  target: MenuItemTarget
  cssClass: string | null
  rel: string | null
  sortOrder: number
}

export interface Menu {
  id: number
  name: string
  slug: string
  description: string | null
  location: string | null
  isDefault: boolean
  items?: MenuItem[]
}
