import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function cdnMediaBase() {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:3003';
  const cleanBase = cdnUrl.replace(/\/$/, '');
  return cleanBase.endsWith('/medias') ? cleanBase : `${cleanBase}/medias`;
}

function parseMediaPath(value: string) {
  const [pathPart, query = ''] = value.split('?');
  const cleanPath = pathPart.replace(/^\/?medias\//, '').replace(/^\//, '');
  return { path: cleanPath, query };
}

export function normalizeCdnPath(value: string | null | undefined) {
  if (!value) return '';
  if (value.startsWith('data:') || value.startsWith('blob:')) return value;

  try {
    const url = new URL(value);
    const mediaIndex = url.pathname.indexOf('/medias/');
    const pathname = mediaIndex >= 0 ? url.pathname.slice(mediaIndex + '/medias/'.length) : url.pathname;
    return decodeURIComponent(pathname.replace(/^\//, ''));
  } catch {
    return parseMediaPath(value).path;
  }
}

export function absoluteCdnUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;

  try {
    const url = new URL(path);
    const mediaIndex = url.pathname.indexOf('/medias/');
    if (mediaIndex === -1) return path;
    const mediaPath = url.pathname.slice(mediaIndex + '/medias/'.length);
    return `${cdnMediaBase()}/${mediaPath.replace(/^\//, '')}${url.search}`;
  } catch {
    const { path: cleanPath, query } = parseMediaPath(path);
    return `${cdnMediaBase()}/${cleanPath}${query ? `?${query}` : ''}`;
  }
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
