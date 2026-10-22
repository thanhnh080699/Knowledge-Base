# Shared CMS components

Reuse the existing components before adding new ones. Keep entity-specific fields and mutations in their screens; share layout and interaction behavior.

- `components/ui/table.tsx`: all tabular layouts. Pass `pagination={{ list, total, loading }}` and `error` for record lists. Use its header, body, row and cell primitives; avoid raw table markup or additional overflow wrappers.
- `components/shared/list-pagination.tsx`: the same range, page size and first/previous/next/last controls for tables, media grids and menu chooser lists. Use the API total, not the visible row count.
- `hooks/use-list-state.ts`: page, page size, filter reset and page-scoped bulk selection. `useClientList` sorts complete non-paginated API arrays by numeric ID descending before slicing. `useScopedSelection` also supports media paths.
- `components/ui/select.tsx`, `input.tsx`, `textarea.tsx`, `checkbox.tsx`, `label.tsx`: form controls. Retain `w-auto` for compact filter selects. Native selects retain keyboard behavior; the shared CSS handles arrow spacing and light/dark colors.
- `components/layout/sidebar.tsx`: one navigation implementation for the desktop sidebar and the mobile navigation modal. Keep mobile navigation separate from the saved desktop collapse preference.
- `components/ui/modal.tsx`, `button.tsx`, `tag.tsx`, `card.tsx`: dialogs, actions, status indicators and containers.
- `components/content/taxonomy-page.tsx`: Categories and Tags share one listing. Categories display an expandable parent–child tree; paginate root branches so descendants never split across pages. Search retains ancestors and expands matching paths. Tags retain ID descending list order. Both use the shared table and pagination; drag ordering remains in the existing reorder modal.

Paginated record endpoints (Posts, Pages, Projects, Comments, Q&A) receive `sort=id` explicitly. The API allowlists this opt-in and orders before pagination; public sort defaults are preserved. Full-array endpoints (Users, Roles, Permissions, Tags, Contacts, Tokens, LLM providers, Menus) use `useClientList`.

Media objects have paths rather than numeric IDs. Their existing default is modification time descending. The media page uses offset pagination; search filters the complete folder metadata before slicing because the CDN has no search endpoint. The existing media picker can keep progressive loading through the same fetch helper.

Analytics tables display metric rankings and have no entity IDs; retain their source ranking and reuse Table primitives. Menu item ordering and LLM provider routing priority are editor/domain data, separate from list display order.

Verify with `node --test tests/list-state.test.cjs`, TypeScript and a production build. For list behavior, check page changes, page size, filter reset, empty/error states, last-page shrinkage and clearing selection across pages/filters.
