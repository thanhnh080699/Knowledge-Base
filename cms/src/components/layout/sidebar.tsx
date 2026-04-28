"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Menu,
  ChevronDown,
  Shield,
  Tag,
  Image,
  Navigation,
  Files,
  CircleHelp,
  MessageSquareText,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSettingsGroup } from "@/hooks/queries/use-settings";
import { absoluteCdnUrl } from "@/lib/utils";

type NavItem = {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: { name: string; href: string }[];
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    group: "DASHBOARD",
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    group: "CONTENT",
    items: [
      { name: "Posts", href: "/posts", icon: FileText },
      { name: "Pages", href: "/pages", icon: Files },
      { name: "Q&A", href: "/question-answers", icon: CircleHelp },
      { name: "Comments", href: "/comments", icon: MessageSquareText },
      { name: "Categories", href: "/categories", icon: FolderOpen },
      { name: "Tags", href: "/tags", icon: Tag },
      { name: "Menus", href: "/menus", icon: Navigation },
    ],
  },
  {
    group: "MEDIA MANAGER",
    items: [{ name: "Media Library", href: "/media", icon: Image }],
  },

  {
    group: "SYSTEM",
    items: [
      {
        name: "Users & ACL",
        icon: Shield,
        children: [
          { name: "Users", href: "/users" },
          { name: "Roles", href: "/roles" },
          { name: "Permissions", href: "/permissions" },
        ],
      },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const [openMenus, setOpenMenus] = useState<string[]>(["Users & ACL"]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const { data: appearance } = useSettingsGroup("admin-appearance");
  const adminLogo = appearance?.values?.admin_logo as string;

  return (
    <div
      className={cn(
        "flex flex-col border-r border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-bg)] text-[var(--app-sidebar-text)] transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center border-b border-[var(--app-sidebar-border)] px-4">
        {isOpen && (
          <div className="flex items-center gap-2 flex-1">
            {adminLogo ? (
              <img
                src={absoluteCdnUrl(adminLogo)}
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--app-brand-badge-bg)]">
                  <span className="text-xl font-bold text-[var(--app-brand-badge-text)]">
                    T
                  </span>
                </div>
                <span className="text-lg font-bold tracking-tight text-[var(--app-sidebar-text-strong)]">
                  Thanhnh.
                </span>
              </>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            "text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-item-hover-bg)] hover:text-[var(--app-sidebar-item-hover-text)]",
            !isOpen && "mx-auto",
            isOpen && "ml-auto",
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-1">
            {isOpen && (
              <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)]">
                {group.group}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const hasChildren = !!item.children;
                const isMenuOpen = openMenus.includes(item.name);
                const isActive = item.href
                  ? pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  : item.children?.some((c) => pathname === c.href);

                return (
                  <div key={item.name} className="space-y-1">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                          isActive
                            ? "bg-[var(--app-sidebar-item-active-bg)] text-[var(--app-sidebar-item-active-text)]"
                            : "hover:bg-[var(--app-sidebar-item-hover-bg)] hover:text-[var(--app-sidebar-item-hover-text)]",
                          !isOpen && "justify-center px-2",
                        )}
                        title={!isOpen ? item.name : undefined}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isOpen && "mr-3",
                            isActive
                              ? "text-[var(--app-sidebar-item-active-text)]"
                              : "text-[var(--app-sidebar-icon)] group-hover:text-[var(--app-sidebar-item-hover-text)]",
                          )}
                        />
                        {isOpen && <span>{item.name}</span>}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={cn(
                          "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                          isActive
                            ? "bg-[var(--app-sidebar-item-active-bg)] text-[var(--app-sidebar-item-active-text)]"
                            : "hover:bg-[var(--app-sidebar-item-hover-bg)] hover:text-[var(--app-sidebar-item-hover-text)]",
                          !isOpen && "justify-center px-2",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isOpen && "mr-3",
                            isActive
                              ? "text-[var(--app-sidebar-item-active-text)]"
                              : "text-[var(--app-sidebar-icon)] group-hover:text-[var(--app-sidebar-item-hover-text)]",
                          )}
                        />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-left">
                              {item.name}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                isMenuOpen && "rotate-180",
                              )}
                            />
                          </>
                        )}
                      </button>
                    )}

                    {isOpen && hasChildren && isMenuOpen && (
                      <div className="ml-9 space-y-1 mt-1">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block rounded-md px-3 py-1.5 text-xs transition-colors",
                                isChildActive
                                  ? "bg-[var(--app-sidebar-item-active-bg)] text-[var(--app-sidebar-item-active-text)]"
                                  : "text-[var(--app-sidebar-subitem-text)] hover:text-[var(--app-sidebar-item-hover-text)]",
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--app-sidebar-border)] p-4">
        <div
          className={cn("flex items-center gap-3", !isOpen && "justify-center")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-sidebar-avatar-bg)] text-xs font-bold text-[var(--app-sidebar-avatar-text)]">
            N
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-[var(--app-sidebar-text-strong)]">
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
