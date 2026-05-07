'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tag } from '@/components/ui/tag';
import { Modal } from '@/components/ui/modal';
import { useContacts } from '@/hooks/queries/use-contacts';
import { useUpdateContactStatus, useDeleteContact } from '@/hooks/mutations/use-contact-mutations';
import { formatDateTime, formatDisplayId } from '@/lib/admin-format';
import { Filter, RotateCcw, Search, MessageSquare, Mail, Phone, Trash2, CheckCircle2, Eye } from 'lucide-react';
import type { ContactRequest } from '@/types/contact';

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]';

function statusVariant(status: string) {
  if (status === 'REPLIED') return 'success';
  if (status === 'ARCHIVED') return 'secondary';
  return 'warning';
}

export default function ContactsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewContact, setViewContact] = useState<ContactRequest | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
      status: status || undefined,
    }),
    [query, status]
  );

  const { data: contactsResponse, isLoading, refetch } = useContacts(filters);
  const updateStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();

  const contacts = contactsResponse?.data ?? [];

  const isAllSelected = contacts.length > 0 && selectedIds.length === contacts.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < contacts.length;

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(c => c.id));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function resetFilters() {
    setQuery('');
    setStatus('');
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteContact.mutateAsync(deleteId);
    setDeleteId(null);
  }

  async function handleBulkMarkReplied() {
    for (const id of selectedIds) {
      await updateStatus.mutateAsync({ id, status: 'REPLIED' });
    }
    setSelectedIds([]);
  }

  async function handleBulkDelete() {
    for (const id of selectedIds) {
      await deleteContact.mutateAsync(id);
    }
    setSelectedIds([]);
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Contacts</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage incoming contact requests and potential leads from your website.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIds.length > 0 ? (
              <>
                <Button variant="outline" size="sm" className="h-10 gap-2 px-4" onClick={handleBulkMarkReplied}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Replied ({selectedIds.length})
                </Button>
                <Button variant="outline" size="sm" className="h-10 gap-2 px-4 text-red-600 hover:bg-red-50" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete ({selectedIds.length})
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="h-10 gap-2 px-4" onClick={() => refetch()}>
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="REPLIED">Replied</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </TableHead>
                  <TableHead className="w-[110px] px-4">ID</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading contacts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-[var(--app-muted)]">
                      <div className="flex flex-col items-center gap-2">
                         <MessageSquare className="h-8 w-8 text-slate-300" />
                         <span>No contact requests found.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact: ContactRequest) => (
                    <TableRow key={contact.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={() => toggleSelect(contact.id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">{formatDisplayId(contact.id)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 py-2 min-w-[200px]">
                          <div className="font-semibold text-[var(--app-muted-strong)]">{contact.name}</div>
                          <div className="flex items-center gap-2 text-xs text-[var(--app-muted)]">
                            <Mail className="h-3 w-3" /> {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)]">
                              <Phone className="h-3 w-3" /> {contact.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md py-2">
                          <p className="line-clamp-3 text-sm text-[var(--app-muted)] whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag variant={statusVariant(contact.status)}>{contact.status}</Tag>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)] whitespace-nowrap">{formatDateTime(contact.createdAt)}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewContact(contact)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateStatus.mutate({ id: contact.id, status: 'REPLIED' })}
                            title="Mark as replied"
                            disabled={contact.status === 'REPLIED'}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() => setDeleteId(contact.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3">
            <span className="text-sm text-[var(--app-muted)]">Total {contacts.length} requests</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!viewContact}
        onClose={() => setViewContact(null)}
        title="Contact Request Details"
      >
        {viewContact && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Name</label>
              <p className="mt-1 text-sm text-[var(--foreground)]">{viewContact.name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Email</label>
              <p className="mt-1 text-sm text-[var(--foreground)]">{viewContact.email}</p>
            </div>
            {viewContact.phone && (
              <div>
                <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Phone</label>
                <p className="mt-1 text-sm text-[var(--foreground)]">{viewContact.phone}</p>
              </div>
            )}
            {viewContact.subject && (
              <div>
                <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Subject</label>
                <p className="mt-1 text-sm text-[var(--foreground)]">{viewContact.subject}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Message</label>
              <p className="mt-1 text-sm text-[var(--foreground)] whitespace-pre-wrap">{viewContact.message}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Status</label>
              <div className="mt-1">
                <Tag variant={statusVariant(viewContact.status)}>{viewContact.status}</Tag>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--app-muted)] uppercase">Submitted At</label>
              <p className="mt-1 text-sm text-[var(--foreground)]">{formatDateTime(viewContact.createdAt)}</p>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={() => setViewContact(null)}>Close</Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Contact Request"
        description="Are you sure you want to delete this contact request? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button type="button" variant="destructive" isLoading={deleteContact.isPending} onClick={handleDelete}>
            Delete Permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
}
