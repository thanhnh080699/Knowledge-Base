export type MenuItemType = "CUSTOM" | "PAGE" | "POST" | "CATEGORY" | "TAG";
export type MenuItemTarget = "_self" | "_blank";

export interface MenuItem {
  id: number;
  menuId: number;
  parentId: number | null;
  title: string;
  url: string | null;
  type: MenuItemType;
  referenceId: number | null;
  target: MenuItemTarget;
  cssClass: string | null;
  rel: string | null;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  isDefault: boolean;
  items?: MenuItem[];
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface MenuFilters {
  q?: string;
  page?: number;
  limit?: number;
}

export interface MenuItemPayload {
  id?: number;
  parentId?: number | null;
  title: string;
  url?: string;
  type?: MenuItemType;
  referenceId?: number;
  target?: MenuItemTarget;
  cssClass?: string;
  rel?: string;
  sortOrder?: number;
}

export interface CreateMenuPayload {
  name: string;
  slug: string;
  description?: string;
  location?: string;
  isDefault?: boolean;
  items?: MenuItemPayload[];
}

export type UpdateMenuPayload = Partial<CreateMenuPayload>;
