import type { Category } from '@/types/taxonomy'

export interface CategoryNode extends Category {
  children: CategoryNode[]
}

// Build from the complete collection; a missing parent remains visible as a root.
// Break malformed cycles so an API mistake cannot hide records or recurse forever.
export function buildCategoryTree(items: readonly Category[]): CategoryNode[] {
  const nodes = new Map(items.map(item => [item.id, { ...item, children: [] as CategoryNode[] }]))
  const roots: CategoryNode[] = []
  for (const node of nodes.values()) {
    const seen = new Set([node.id])
    let ancestor = node.parentId == null ? undefined : nodes.get(node.parentId)
    let cyclic = false
    while (ancestor) {
      if (seen.has(ancestor.id)) { cyclic = true; break }
      seen.add(ancestor.id)
      ancestor = ancestor.parentId == null ? undefined : nodes.get(ancestor.parentId)
    }
    const parent = node.parentId == null ? undefined : nodes.get(node.parentId)
    if (parent && !cyclic) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

export function filterCategoryTree(nodes: CategoryNode[], query: string): CategoryNode[] {
  const needle = query.trim().toLocaleLowerCase('vi')
  if (!needle) return nodes
  return nodes.flatMap(node => {
    const children = filterCategoryTree(node.children, needle)
    return [node.name, node.slug].some(value => value.toLocaleLowerCase('vi').includes(needle)) || children.length
      ? [{ ...node, children }]
      : []
  })
}

export interface CategoryTreeRow {
  item: CategoryNode
  level: number
  isLast: boolean
  ancestorContinues: boolean[]
}

export function flattenCategoryTree(nodes: CategoryNode[], collapsed: ReadonlySet<number> = new Set(), level = 0, ancestorContinues: boolean[] = []): CategoryTreeRow[] {
  return nodes.flatMap((item, index) => {
    const isLast = index === nodes.length - 1
    return [
      { item, level, isLast, ancestorContinues },
      ...(collapsed.has(item.id) ? [] : flattenCategoryTree(item.children, collapsed, level + 1, level ? [...ancestorContinues, !isLast] : [])),
    ]
  })
}
