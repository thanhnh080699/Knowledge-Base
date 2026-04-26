import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteCdnUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:3002';
  return `${cdnUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
