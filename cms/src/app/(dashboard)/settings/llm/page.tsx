"use client";

import { Select } from '@/components/ui/select'
import { useClientList, useListState } from '@/hooks/use-list-state'
import Link from "next/link";
import { type FormEvent, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Tag } from "@/components/ui/tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateLlmProvider,
  useDeleteLlmProvider,
  useTestLlmConnection,
  useTestSavedLlmProvider,
  useUpdateLlmProvider,
} from "@/hooks/mutations/use-setting-mutations";
import { useLlmModels, useLlmProviders } from "@/hooks/queries/use-settings";
import type {
  LlmDriver,
  LlmProvider,
  LlmProviderPayload,
} from "@/types/settings";

const DRIVER_OPTIONS: Array<{
  value: LlmDriver;
  label: string;
  baseUrl: string;
}> = [
  { value: "openai", label: "OPENAI", baseUrl: "https://api.openai.com/v1" },
  {
    value: "gemini",
    label: "Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  {
    value: "nvidia",
    label: "NVIDIA",
    baseUrl: "https://integrate.api.nvidia.com/v1",
  },
  {
    value: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
  },
  { value: "custom", label: "Custom", baseUrl: "" },
];

const TASK_OPTIONS = [
  { value: "general", label: "General" },
  { value: "content_generation", label: "Content generation" },
  { value: "summarization", label: "Summarization" },
  { value: "translation", label: "Translation" },
  { value: "code_assistant", label: "Code assistant" },
  { value: "fallback", label: "Fallback" },
];

const emptyForm: LlmProviderPayload = {
  name: "",
  driver: "openai",
  modelName: "gpt-5.2",
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  tasks: ["general"],
  isActive: true,
  sortOrder: 0,
};

function driverBaseUrl(driver: LlmDriver) {
  return (
    DRIVER_OPTIONS.find((option) => option.value === driver)?.baseUrl ?? ""
  );
}

function formatTokenCount(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function providerToForm(provider?: LlmProvider): LlmProviderPayload {
  if (!provider) {
    return emptyForm;
  }

  return {
    name: provider.name,
    driver: provider.driver,
    modelName: provider.modelName,
    apiKey: "",
    baseUrl: provider.baseUrl ?? driverBaseUrl(provider.driver),
    tasks: provider.tasks.length ? provider.tasks : ["general"],
    isActive: provider.isActive,
    sortOrder: provider.sortOrder,
  };
}

export default function LlmSettingsPage() {
  const list = useListState()
  const { data: allItems = [], isLoading, isFetching, error } = useLlmProviders()
  const providers = useClientList(allItems, list)
  const total = allItems.length;
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<LlmProvider | null>(
    null,
  );
  const deleteProvider = useDeleteLlmProvider();
  const testSavedProvider = useTestSavedLlmProvider();

  const activeCount = allItems.filter((provider) => provider.isActive).length;

  function openCreateModal() {
    setEditingProvider(null);
    setModalOpen(true);
  }

  function openEditModal(provider: LlmProvider) {
    setEditingProvider(provider);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Dashboard
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/settings" className="text-blue-600 hover:text-blue-700">
            Settings
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">LLM</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              LLM Providers
            </h3>
            <span className="text-sm text-[var(--app-muted)]">
              Manage multiple active providers and assign them to different AI
              tasks.
            </span>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add provider
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total providers" value={allItems.length} />
          <SummaryCard label="Active providers" value={activeCount} />
          <SummaryCard
            label="Inactive providers"
            value={allItems.length - activeCount}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <Table pagination={{ list, total, loading: isFetching }} error={error}>
            <TableHeader className="bg-[var(--app-surface-muted)]">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Total Usage</TableHead>
                <TableHead>In / Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-36"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading LLM providers...</TableCell>
                </TableRow>
              ) : providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No LLM providers found.</TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--app-surface-muted)] text-[var(--app-muted)]">
                          <Bot className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {provider.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">
                      {provider.driver}
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-[var(--app-surface-muted)] px-2 py-1 text-xs">
                        {provider.modelName}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[var(--foreground)]">
                        {formatTokenCount(provider.totalTokens)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[var(--foreground)]">
                        {formatTokenCount(provider.inputTokens)}/
                        {formatTokenCount(provider.outputTokens)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Tag
                        variant={provider.isActive ? "success" : "secondary"}
                      >
                        {provider.isActive ? "Active" : "Inactive"}
                      </Tag>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => testSavedProvider.mutate(provider.id)}
                          aria-label="Test provider"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(provider)}
                          aria-label="Edit provider"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProvider.mutate(provider.id)}
                          aria-label="Delete provider"
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
      </div>

      <ProviderModal
        key={`${editingProvider ? `edit-${editingProvider.id}` : "create"}-${isModalOpen ? "open" : "closed"}`}
        isOpen={isModalOpen}
        provider={editingProvider ?? undefined}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
      <div className="text-sm text-[var(--app-muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        {value}
      </div>
    </div>
  );
}

function ProviderModal({
  isOpen,
  provider,
  onClose,
}: {
  isOpen: boolean;
  provider?: LlmProvider;
  onClose: () => void;
}) {
  const [form, setForm] = useState<LlmProviderPayload>(() =>
    providerToForm(provider),
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const createProvider = useCreateLlmProvider();
  const updateProvider = useUpdateLlmProvider();
  const testConnection = useTestLlmConnection();
  const modelsQuery = useLlmModels({
    driver: form.driver,
    apiKey: form.apiKey || undefined,
    baseUrl: form.baseUrl || undefined,
    enabled: false,
  });
  const models = modelsQuery.data?.models ?? [];

  function updateForm(value: Partial<LlmProviderPayload>) {
    setForm((current) => ({ ...current, ...value }));
  }

  function changeDriver(driver: LlmDriver) {
    updateForm({
      driver,
      baseUrl: driverBaseUrl(driver),
      modelName: "",
    });
  }

  function toggleTask(task: string) {
    setForm((current) => {
      const tasks = current.tasks.includes(task)
        ? current.tasks.filter((item) => item !== task)
        : [...current.tasks, task];

      return { ...current, tasks: tasks.length ? tasks : ["general"] };
    });
  }

  async function refreshModels() {
    const result = await modelsQuery.refetch();
    if (result.error) {
      toast.error(
        result.error instanceof Error
          ? result.error.message
          : "Không thể tải danh sách model",
      );
      return;
    }

    const firstModel = result.data?.models?.[0];
    if (
      firstModel &&
      !result.data?.models?.some((model) => model.id === form.modelName)
    ) {
      updateForm({ modelName: firstModel.id });
    }
  }

  async function testDraftConnection() {
    if (!form.apiKey?.trim()) {
      toast.error("Vui lòng nhập API key");
      return;
    }

    await testConnection.mutateAsync({
      driver: form.driver,
      apiKey: form.apiKey || "",
      baseUrl: form.baseUrl || undefined,
      modelName: form.modelName,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.modelName.trim() || !form.apiKey?.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên, model và API key");
      return;
    }

    if (!provider && form.tasks.length === 0) {
      toast.error("Vui lòng chọn ít nhất một task");
      return;
    }

    const payload = provider
      ? {
          ...form,
          tasks: provider.tasks.length ? provider.tasks : ["general"],
        }
      : form;

    if (provider) {
      await updateProvider.mutateAsync({ id: provider.id, payload });
    } else {
      await createProvider.mutateAsync(payload);
    }

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={provider ? "Edit LLM provider" : "Add LLM provider"}
      description="Configure provider connection, active state and task assignment."
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="provider-name">Name</Label>
            <Input
              id="provider-name"
              value={form.name}
              onChange={(event) => updateForm({ name: event.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="provider-driver">Driver</Label>
            <Select
              id="provider-driver"
              value={form.driver}
              onChange={(event) =>
                changeDriver(event.target.value as LlmDriver)
              }
              className="mt-2 h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
            >
              {DRIVER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="provider-base-url">Base URL</Label>
            <Input
              id="provider-base-url"
              value={form.baseUrl ?? ""}
              onChange={(event) => updateForm({ baseUrl: event.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="provider-api-key">
              API key <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Input
                id="provider-api-key"
                type={showApiKey ? "text" : "password"}
                value={form.apiKey ?? ""}
                onChange={(event) => updateForm({ apiKey: event.target.value })}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowApiKey((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]"
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="provider-model">Model name</Label>
          <div className="mt-2 grid gap-3 md:grid-cols-[1fr_260px]">
            <Input
              id="provider-model"
              value={form.modelName}
              onChange={(event) =>
                updateForm({ modelName: event.target.value })
              }
              required
            />
            <Select
              value={
                models.some((model) => model.id === form.modelName)
                  ? form.modelName
                  : ""
              }
              onChange={(event) =>
                updateForm({ modelName: event.target.value })
              }
              className="h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div
          className={
            provider
              ? "grid gap-5 md:grid-cols-[180px_1fr]"
              : "grid gap-5 md:grid-cols-[1fr_180px]"
          }
        >
          {!provider && (
            <div>
              <Label>Tasks</Label>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {TASK_OPTIONS.map((task) => (
                  <label
                    key={task.value}
                    className="flex items-center gap-3 rounded-md border border-[var(--app-border)] p-3"
                  >
                    <Checkbox
                      checked={form.tasks.includes(task.value)}
                      onChange={() => toggleTask(task.value)}
                    />
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {task.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Status</Label>
            <label className="mt-2 flex h-10 items-center gap-3 rounded-md border border-[var(--app-border)] px-3">
              <Checkbox
                checked={!!form.isActive}
                onChange={() => updateForm({ isActive: !form.isActive })}
              />
              <span className="text-sm font-medium text-[var(--foreground)]">
                Active
              </span>
            </label>
          </div>
        </div>

        {testConnection.data?.connected && (
          <div className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Connected
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--app-border)] pt-5">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              isLoading={modelsQuery.isFetching}
              onClick={refreshModels}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh models
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              isLoading={testConnection.isPending}
              onClick={testDraftConnection}
            >
              <ShieldCheck className="h-4 w-4" />
              Test connection
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createProvider.isPending || updateProvider.isPending}
            >
              Save provider
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
