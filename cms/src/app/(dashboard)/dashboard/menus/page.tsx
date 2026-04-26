"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateMenu,
  useDeleteMenu,
  useSetDefaultMenu,
  useUpdateMenu,
} from "@/hooks/mutations/use-menu-mutations";
import { useMenus, useMenu } from "@/hooks/queries/use-menus";
import { usePages } from "@/hooks/queries/use-pages";
import { cn, slugify } from "@/lib/utils";
import type { MenuItemPayload } from "@/types/menu";
import {
  Check,
  GripVertical,
  Home,
  Link2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

type DraftItem = MenuItemPayload & { id: number; parentId: number | null };

const SELECT_CLASS =
  "h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]";

function flattenItems(
  items: DraftItem[],
  parentId: number | null = null,
  depth = 0,
): Array<DraftItem & { depth: number }> {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .flatMap((item) => [
      { ...item, depth },
      ...flattenItems(items, item.id, depth + 1),
    ]);
}

function normalizeOrder(items: DraftItem[]) {
  const copy = [...items];
  const byParent = new Map<number | null, DraftItem[]>();
  for (const item of copy) {
    const list = byParent.get(item.parentId) ?? [];
    list.push(item);
    byParent.set(item.parentId, list);
  }

  return copy.map((item) => {
    const siblings = byParent.get(item.parentId) ?? [];
    const ordered = siblings.sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    return {
      ...item,
      sortOrder: ordered.findIndex((sibling) => sibling.id === item.id),
    };
  });
}

export default function MenusPage() {
  const { data: menus = [] } = useMenus();
  const { data: pagesResponse } = usePages({
    page: 1,
    limit: 100,
    status: "PUBLISHED",
  });
  const pages = pagesResponse?.data ?? [];
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const { data: selectedMenu } = useMenu(selectedMenuId);
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();
  const setDefaultMenu = useSetDefaultMenu();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("header");
  const [isDefault, setIsDefault] = useState(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    if (!selectedMenuId && menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  useEffect(() => {
    if (!selectedMenu) return;
    setName(selectedMenu.name);
    setSlug(selectedMenu.slug);
    setDescription(selectedMenu.description ?? "");
    setLocation(selectedMenu.location ?? "header");
    setIsDefault(selectedMenu.isDefault);
    setItems(
      (selectedMenu.items ?? []).map((item) => ({
        id: item.id,
        parentId: item.parentId,
        title: item.title,
        url: item.url ?? "",
        type: item.type,
        referenceId: item.referenceId ?? undefined,
        target: item.target,
        cssClass: item.cssClass ?? "",
        rel: item.rel ?? "",
        sortOrder: item.sortOrder,
      })),
    );
  }, [selectedMenu]);

  const flattenedItems = useMemo(() => flattenItems(items), [items]);
  const isSaving = createMenu.isPending || updateMenu.isPending;
  const isNew = selectedMenuId === null;

  function startNewMenu() {
    setSelectedMenuId(null);
    setName("");
    setSlug("");
    setDescription("");
    setLocation("header");
    setIsDefault(false);
    setItems([]);
  }

  function updateName(value: string) {
    setName(value);
    if (isNew) setSlug(slugify(value));
  }

  function addCustomItem() {
    if (!customTitle.trim() || !customUrl.trim()) return;
    setItems((current) =>
      normalizeOrder([
        ...current,
        {
          id: Date.now() * -1,
          parentId: null,
          title: customTitle.trim(),
          url: customUrl.trim(),
          type: "CUSTOM",
          target: "_self",
          sortOrder: current.filter((item) => item.parentId === null).length,
        },
      ]),
    );
    setCustomTitle("");
    setCustomUrl("");
  }

  function addPageItem(pageId: number) {
    const page = pages.find((item) => item.id === pageId);
    if (!page) return;
    setItems((current) =>
      normalizeOrder([
        ...current,
        {
          id: Date.now() * -1,
          parentId: null,
          title: page.title,
          url: `/${page.slug}`,
          type: "PAGE",
          referenceId: page.id,
          target: "_self",
          sortOrder: current.filter((item) => item.parentId === null).length,
        },
      ]),
    );
  }

  function updateItem(itemId: number, patch: Partial<DraftItem>) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    );
  }

  function removeItem(itemId: number) {
    const childIds = new Set<number>();
    function collect(id: number) {
      for (const child of items.filter((item) => item.parentId === id)) {
        childIds.add(child.id);
        collect(child.id);
      }
    }
    collect(itemId);
    setItems((current) =>
      normalizeOrder(
        current.filter((item) => item.id !== itemId && !childIds.has(item.id)),
      ),
    );
  }

  function moveItem(itemId: number, direction: -1 | 1) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === itemId);
      if (!item) return current;
      const siblings = current
        .filter((entry) => entry.parentId === item.parentId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const index = siblings.findIndex((entry) => entry.id === itemId);
      const target = siblings[index + direction];
      if (!target) return current;
      return normalizeOrder(
        current.map((entry) => {
          if (entry.id === item.id)
            return { ...entry, sortOrder: target.sortOrder };
          if (entry.id === target.id)
            return { ...entry, sortOrder: item.sortOrder };
          return entry;
        }),
      );
    });
  }

  function outdentItem(itemId: number) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === itemId);
      const parent = item
        ? current.find((entry) => entry.id === item.parentId)
        : null;
      if (!item || !parent) return current;
      return normalizeOrder(
        current.map((entry) =>
          entry.id === itemId
            ? { ...entry, parentId: parent.parentId ?? null }
            : entry,
        ),
      );
    });
  }

  function handleDrop(targetId: number) {
    if (!draggingId || draggingId === targetId) return;
    const descendants = new Set(
      flattenItems(items, draggingId).map((item) => item.id),
    );
    if (descendants.has(targetId)) return;
    setItems((current) =>
      normalizeOrder(
        current.map((item) =>
          item.id === draggingId
            ? {
                ...item,
                parentId: targetId,
                sortOrder: current.filter(
                  (entry) => entry.parentId === targetId,
                ).length,
              }
            : item,
        ),
      ),
    );
    setDraggingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      isDefault,
      items: normalizeOrder(items).map((item) => ({
        id: item.id,
        parentId: item.parentId,
        title: item.title,
        url: item.url,
        type: item.type,
        referenceId: item.referenceId,
        target: item.target,
        cssClass: item.cssClass,
        rel: item.rel,
        sortOrder: item.sortOrder,
      })),
    };

    const saved = isNew
      ? await createMenu.mutateAsync(payload)
      : await updateMenu.mutateAsync({ id: selectedMenuId, payload });
    setSelectedMenuId(saved.id);
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Menus
            </h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Build Botble-style nested navigation and choose the default
              homepage menu.
            </span>
          </div>
          <Button size="sm" className="h-10 gap-2" onClick={startNewMenu}>
            <Plus className="h-4 w-4" />
            Create Menu
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
            <div className="border-b border-[var(--app-border)] px-4 py-3">
              <h4 className="font-semibold text-[var(--foreground)]">
                Menu List
              </h4>
            </div>
            <div className="divide-y divide-[var(--app-border)]">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--app-surface-hover)]",
                    selectedMenuId === menu.id &&
                      "bg-[var(--app-surface-muted)]",
                  )}
                  onClick={() => setSelectedMenuId(menu.id)}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-[var(--app-muted-strong)]">
                      {menu.name}
                    </span>
                    <span className="block truncate font-mono text-xs text-[var(--app-muted)]">
                      {menu.slug}
                    </span>
                  </span>
                  {menu.isDefault ? (
                    <Home className="h-4 w-4 text-emerald-600" />
                  ) : null}
                </button>
              ))}
              {menus.length === 0 ? (
                <div className="px-4 py-8 text-sm text-[var(--app-muted)]">
                  No menus.
                </div>
              ) : null}
            </div>
          </aside>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="menu-name">Name</Label>
                  <Input
                    id="menu-name"
                    value={name}
                    onChange={(event) => updateName(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-slug">Slug</Label>
                  <Input
                    id="menu-slug"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-location">Location</Label>
                  <select
                    id="menu-location"
                    className={SELECT_CLASS}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <label className="mt-7 flex items-center gap-3 text-sm text-[var(--app-muted-strong)]">
                  <Checkbox
                    checked={isDefault}
                    onChange={(event) =>
                      setIsDefault(event.currentTarget.checked)
                    }
                  />
                  Default menu for homepage
                </label>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="menu-description">Description</Label>
                  <Textarea
                    id="menu-description"
                    className="min-h-20"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
                  <h4 className="mb-4 font-semibold text-[var(--foreground)]">
                    Add Custom Link
                  </h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Title"
                      value={customTitle}
                      onChange={(event) => setCustomTitle(event.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={customUrl}
                      onChange={(event) => setCustomUrl(event.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={addCustomItem}
                    >
                      <Link2 className="h-4 w-4" />
                      Add Link
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
                  <h4 className="mb-4 font-semibold text-[var(--foreground)]">
                    Add Page
                  </h4>
                  <div className="max-h-72 space-y-2 overflow-y-auto">
                    {pages.map((page) => (
                      <Button
                        key={page.id}
                        type="button"
                        variant="ghost"
                        className="h-auto w-full justify-start px-3 py-2 text-left"
                        onClick={() => addPageItem(page.id)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{page.title}</span>
                          <span className="block truncate font-mono text-xs text-[var(--app-muted)]">
                            /{page.slug}
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--app-border)] px-4 py-3">
                  <h4 className="font-semibold text-[var(--foreground)]">
                    Menu Structure
                  </h4>
                  <span className="text-xs text-[var(--app-muted)]">
                    Drag a row onto another row to make it a child.
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  {flattenedItems.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[var(--app-border)] p-8 text-center text-sm text-[var(--app-muted)]">
                      No menu items.
                    </div>
                  ) : (
                    flattenedItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggingId(item.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleDrop(item.id)}
                        className={cn(
                          "rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm",
                          draggingId === item.id && "opacity-60",
                        )}
                        style={{ marginLeft: item.depth * 24 }}
                      >
                        <div className="grid gap-3 lg:grid-cols-[24px_1fr_1fr_120px_auto] lg:items-center">
                          <GripVertical className="mt-2 h-4 w-4 cursor-grab text-[var(--app-muted)] lg:mt-0" />
                          <Input
                            value={item.title}
                            onChange={(event) =>
                              updateItem(item.id, { title: event.target.value })
                            }
                          />
                          <Input
                            value={item.url ?? ""}
                            onChange={(event) =>
                              updateItem(item.id, { url: event.target.value })
                            }
                          />
                          <select
                            className={SELECT_CLASS}
                            value={item.target ?? "_self"}
                            onChange={(event) =>
                              updateItem(item.id, {
                                target: event.target.value as
                                  | "_self"
                                  | "_blank",
                              })
                            }
                          >
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                          </select>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveItem(item.id, -1)}
                            >
                              Up
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveItem(item.id, 1)}
                            >
                              Down
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => outdentItem(item.id)}
                            >
                              Out
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-[var(--app-danger-soft-fg)]"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {!isNew ? (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setDefaultMenu.mutate(selectedMenuId)}
                >
                  <Home className="h-4 w-4" />
                  Set Default
                </Button>
              ) : null}
              {!isNew ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="gap-2"
                  onClick={() => deleteMenu.mutate(selectedMenuId)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              ) : null}
              <Button type="submit" isLoading={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                Save Menu
              </Button>
              {selectedMenu?.isDefault ? (
                <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm text-emerald-700">
                  <Check className="h-4 w-4" />
                  Default
                </span>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
