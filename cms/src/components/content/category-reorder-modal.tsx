'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'
import type { Category } from '@/types/taxonomy'

interface SortableItemProps {
  id: number
  name: string
  level: number
}

function SortableItem({ id, name, level }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${level * 24}px`,
    zIndex: isDragging ? 10 : 0,
    position: 'relative' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 mb-2 shadow-sm transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-[var(--app-accent-soft-fg)] shadow-md' : 'hover:border-[var(--app-accent-soft-fg)]'
      }`}
    >
      <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-[var(--app-accent-soft-fg)]">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="font-medium text-sm text-[var(--app-muted-strong)]">{name}</span>
    </div>
  )
}

interface CategoryReorderModalProps {
  isOpen: boolean
  onClose: () => void
  items: Category[]
  onSave: (items: { id: number; parent_id: number | null; sort_order: number }[]) => Promise<void>
  isSubmitting: boolean
}

export function CategoryReorderModal({ isOpen, onClose, items, onSave, isSubmitting }: CategoryReorderModalProps) {
  const [flatItems, setFlatItems] = useState<{ id: number; name: string; level: number; parentId: number | null }[]>([])

  useEffect(() => {
    if (isOpen) {
      const flatten = (cats: Category[], level = 0): any[] => {
        return cats.flatMap(cat => [
          { id: cat.id, name: cat.name, level, parentId: cat.parentId },
          ...flatten(cat.children || [], level + 1)
        ])
      }
      setFlatItems(flatten(items))
    }
  }, [isOpen, items])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event

    if (over) {
      setFlatItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id)
        const newIndex = current.findIndex((i) => i.id === over.id)
        let newItems = arrayMove(current, oldIndex, newIndex)
        
        // Calculate level change based on horizontal delta
        // Each level is 24px
        const levelChange = Math.round(delta.x / 24)
        const item = newItems[newIndex]
        let newLevel = Math.max(0, item.level + levelChange)
        
        // Clamp level based on previous item to ensure it's a valid tree
        // An item's level can be at most prevItem.level + 1
        if (newIndex > 0) {
          const prevItem = newItems[newIndex - 1]
          newLevel = Math.min(newLevel, prevItem.level + 1)
        } else {
          newLevel = 0
        }
        
        // Update parentId based on new level
        let newParentId: number | null = null
        if (newLevel > 0) {
          const parent = newItems.findLast((it, idx) => idx < newIndex && it.level === newLevel - 1)
          if (parent) {
            newParentId = parent.id
          } else {
            newLevel = 0
            newParentId = null
          }
        }
        
        newItems[newIndex] = { ...item, level: newLevel, parentId: newParentId }
        return newItems
      })
    }
  }

  async function handleSave() {
    const payload = flatItems.map((item, index) => ({
      id: item.id,
      parent_id: item.parentId,
      sort_order: index,
    }))
    await onSave(payload)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sắp xếp danh mục"
      description="Kéo thả lên xuống để đổi thứ tự, kéo sang trái/phải để đổi cấp bậc."
      className="max-w-2xl"
    >
      <div className="max-h-[60vh] overflow-y-auto px-1 py-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={flatItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {flatItems.length > 0 ? (
              flatItems.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  level={item.level}
                />
              ))
            ) : (
              <div className="py-10 text-center text-[var(--app-muted)]">Không có danh mục nào để sắp xếp</div>
            )}
          </SortableContext>
        </DndContext>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--app-border)]">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSave} isLoading={isSubmitting}>
          Lưu thay đổi
        </Button>
      </div>
    </Modal>
  )
}
