"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Search } from "lucide-react"

interface GitCommand {
  category: string
  command: string
  description: string
  example?: string
}

const GIT_COMMANDS: GitCommand[] = [
  // Setup & Config
  { category: "Setup & Config", command: 'git config --global user.name "Your Name"', description: "Set global git username" },
  { category: "Setup & Config", command: 'git config --global user.email "you@example.com"', description: "Set global git email" },
  { category: "Setup & Config", command: "git config --global init.defaultBranch main", description: "Set default branch name to main" },
  { category: "Setup & Config", command: "git config --list --show-origin", description: "List all configuration variables with file location" },

  // Getting Started
  { category: "Getting Started", command: "git init", description: "Initialize a new local Git repository" },
  { category: "Getting Started", command: "git clone <repo-url>", description: "Clone a remote repository to local machine" },
  { category: "Getting Started", command: "git clone --depth 1 <repo-url>", description: "Shallow clone only latest commit to save bandwidth" },

  // Working with Changes
  { category: "Basic Snapshotting", command: "git status -sb", description: "Show repository status in short branch format" },
  { category: "Basic Snapshotting", command: "git add .", description: "Stage all modified and untracked files" },
  { category: "Basic Snapshotting", command: "git add -p", description: "Interactively stage hunks / parts of modified files" },
  { category: "Basic Snapshotting", command: 'git commit -m "feat: commit message"', description: "Commit staged changes with message" },
  { category: "Basic Snapshotting", command: "git commit --amend --no-edit", description: "Add staged files to the previous commit without changing message" },
  { category: "Basic Snapshotting", command: "git diff", description: "Show unstaged changes in working tree" },
  { category: "Basic Snapshotting", command: "git diff --staged", description: "Show staged changes ready to be committed" },

  // Branching & Merging
  { category: "Branching", command: "git branch -a", description: "List all local and remote tracking branches" },
  { category: "Branching", command: "git switch -c <branch-name>", description: "Create and switch to a new branch" },
  { category: "Branching", command: "git switch <branch-name>", description: "Switch to an existing branch" },
  { category: "Branching", command: "git branch -d <branch-name>", description: "Delete a local branch that has been merged" },
  { category: "Branching", command: "git branch -D <branch-name>", description: "Force delete a local branch regardless of merge status" },
  { category: "Branching", command: "git merge <branch-name>", description: "Merge specified branch into current active branch" },
  { category: "Branching", command: "git merge --abort", description: "Abort a conflicting merge and reset to pre-merge state" },

  // Remote & Sharing
  { category: "Remote Sync", command: "git remote -v", description: "List all configured remote repositories" },
  { category: "Remote Sync", command: "git fetch --all --prune", description: "Fetch all branches from remote and remove deleted remote tracking branches" },
  { category: "Remote Sync", command: "git pull --rebase origin <branch>", description: "Fetch and replay local commits on top of remote branch" },
  { category: "Remote Sync", command: "git push -u origin <branch>", description: "Push current branch and set upstream tracking" },
  { category: "Remote Sync", command: "git push origin --delete <branch>", description: "Delete a remote branch on the server" },

  // Undo & Reset
  { category: "Undo & Revert", command: "git restore <file>", description: "Discard unstaged changes in working directory for a file" },
  { category: "Undo & Revert", command: "git restore --staged <file>", description: "Unstage a file while keeping its changes in working directory" },
  { category: "Undo & Revert", command: "git reset --soft HEAD~1", description: "Undo last commit, keeping changes staged" },
  { category: "Undo & Revert", command: "git reset --mixed HEAD~1", description: "Undo last commit, keeping changes unstaged in working directory" },
  { category: "Undo & Revert", command: "git reset --hard HEAD~1", description: "Discard last commit and all its working tree changes completely" },
  { category: "Undo & Revert", command: "git revert <commit-hash>", description: "Create a new commit that safely reverses a specific commit" },

  // Stash & Inspection
  { category: "Stash & History", command: "git stash push -u -m 'wip'", description: "Stash tracked and untracked changes with description" },
  { category: "Stash & History", command: "git stash list", description: "List all stashed changes" },
  { category: "Stash & History", command: "git stash pop", description: "Apply and remove latest stashed state" },
  { category: "Stash & History", command: "git log --oneline --graph --all", description: "View formatted visual commit history tree" },
  { category: "Stash & History", command: "git cherry-pick <commit-hash>", description: "Apply an existing commit from another branch to current branch" },
  { category: "Stash & History", command: "git clean -fd", description: "Remove untracked files and directories forcefully" },
]

export function GitMemo() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  const categories = useMemo(() => {
    const set = new Set(GIT_COMMANDS.map((c) => c.category))
    return ["ALL", ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return GIT_COMMANDS.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory
      const matchSearch =
        !q ||
        item.command.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Git Cheatsheet &amp; Memo</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Quick reference guide for essential and advanced Git commands with one-click copy.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search git commands (e.g. rebase, amend, stash, undo)..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Command List */}
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-4 shadow-xs transition-all hover:border-[var(--color-brand)]/40"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-md bg-[var(--color-surface-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-muted)]">
                {item.category}
              </span>
              <span className="text-xs font-medium text-[var(--color-muted)]">
                {item.description}
              </span>
            </div>
            <code className="block rounded-lg bg-[var(--color-surface-soft)] p-2.5 pr-10 font-mono text-xs font-semibold text-[var(--color-ink)] break-all">
              {item.command}
            </code>
            <CopyButton text={item.command} />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--color-hairline)] p-8 text-center text-xs text-[var(--color-muted)]">
            No matching Git commands found for &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </div>
  )
}
