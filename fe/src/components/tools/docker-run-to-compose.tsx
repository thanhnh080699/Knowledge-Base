"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/shared/copy-button"
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react"

export function DockerRunToCompose() {
  const [dockerRun, setDockerRun] = useState(
    "docker run -d --name nginx-server -p 8080:80 -v /data/nginx:/usr/share/nginx/html:ro -e NGINX_PORT=80 --restart always nginx:alpine"
  )
  const [composeYaml, setComposeYaml] = useState("")

  const convert = (commandText: string) => {
    const raw = commandText.trim().replace(/\\\s*\n/g, " ")
    if (!raw) {
      setComposeYaml("")
      return
    }

    try {
      // Tokenize command taking into account quotes
      const tokens: string[] = []
      const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g
      let match: RegExpExecArray | null

      while ((match = regex.exec(raw)) !== null) {
        tokens.push(match[1] || match[2] || match[0])
      }

      if (tokens.length === 0) return

      // Skip docker and run
      let idx = 0
      if (tokens[idx] === "docker") idx++
      if (tokens[idx] === "run") idx++

      let containerName = ""
      let restart = ""
      let network = ""
      const ports: string[] = []
      const volumes: string[] = []
      const environment: string[] = []
      let image = ""
      const commandArgs: string[] = []

      while (idx < tokens.length) {
        const token = tokens[idx]

        if (token === "--name" && idx + 1 < tokens.length) {
          containerName = tokens[++idx]
        } else if (token.startsWith("--name=")) {
          containerName = token.split("=")[1]
        } else if ((token === "-p" || token === "--publish") && idx + 1 < tokens.length) {
          ports.push(tokens[++idx])
        } else if (token.startsWith("-p=") || token.startsWith("--publish=")) {
          ports.push(token.split("=")[1])
        } else if ((token === "-v" || token === "--volume") && idx + 1 < tokens.length) {
          volumes.push(tokens[++idx])
        } else if (token.startsWith("-v=") || token.startsWith("--volume=")) {
          volumes.push(token.split("=")[1])
        } else if ((token === "-e" || token === "--env") && idx + 1 < tokens.length) {
          environment.push(tokens[++idx])
        } else if (token.startsWith("-e=") || token.startsWith("--env=")) {
          environment.push(token.split("=")[1])
        } else if (token === "--restart" && idx + 1 < tokens.length) {
          restart = tokens[++idx]
        } else if (token.startsWith("--restart=")) {
          restart = token.split("=")[1]
        } else if ((token === "--net" || token === "--network") && idx + 1 < tokens.length) {
          network = tokens[++idx]
        } else if (token.startsWith("--network=")) {
          network = token.split("=")[1]
        } else if (token === "-d" || token === "--detach" || token === "-it" || token === "-i" || token === "-t" || token === "--rm") {
          // Flags with no args
        } else if (!image && !token.startsWith("-")) {
          image = token
        } else if (image) {
          commandArgs.push(token)
        }
        idx++
      }

      if (!image) {
        setComposeYaml("# Could not detect docker image name from command.")
        return
      }

      const serviceName = (containerName || image.split(/[:/]/)[0] || "app").replace(/[^a-zA-Z0-9_-]/g, "_")

      let yaml = "services:\n"
      yaml += `  ${serviceName}:\n`
      yaml += `    image: ${image}\n`

      if (containerName) {
        yaml += `    container_name: ${containerName}\n`
      }

      if (restart) {
        yaml += `    restart: ${restart}\n`
      }

      if (ports.length > 0) {
        yaml += "    ports:\n"
        ports.forEach((p) => {
          yaml += `      - "${p}"\n`
        })
      }

      if (environment.length > 0) {
        yaml += "    environment:\n"
        environment.forEach((e) => {
          yaml += `      - ${e}\n`
        })
      }

      if (volumes.length > 0) {
        yaml += "    volumes:\n"
        volumes.forEach((v) => {
          yaml += `      - ${v}\n`
        })
      }

      if (network) {
        yaml += "    networks:\n"
        yaml += `      - ${network}\n`
      }

      if (commandArgs.length > 0) {
        yaml += `    command: ${commandArgs.join(" ")}\n`
      }

      if (network) {
        yaml += "\nnetworks:\n"
        yaml += `  ${network}:\n`
        yaml += "    external: true\n"
      }

      setComposeYaml(yaml)
    } catch {
      setComposeYaml("# Error parsing docker run command")
    }
  }

  const handleConvert = () => {
    convert(dockerRun)
  }

  const handleClear = () => {
    setDockerRun("")
    setComposeYaml("")
  }

  const handleSample = () => {
    const sample = "docker run -d --name redis-cache -p 6379:6379 -v /data/redis:/data -e ALLOW_EMPTY_PASSWORD=yes --restart unless-stopped redis:7-alpine redis-server --appendonly yes"
    setDockerRun(sample)
    convert(sample)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Docker Run to Docker Compose</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Convert standard <code className="font-mono bg-[var(--color-surface-soft)] px-1 rounded">docker run</code> CLI commands into clean, reproducible Docker Compose YAML.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSample} variant="outline" size="sm">
            <Sparkles size={14} />
            Load Sample
          </Button>
          <Button onClick={handleClear} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Docker Run Command
            </label>
            <span className="text-[11px] text-[var(--color-muted)]">Supports -p, -v, -e, --name, --restart</span>
          </div>
          <textarea
            value={dockerRun}
            onChange={(e) => {
              setDockerRun(e.target.value)
              convert(e.target.value)
            }}
            placeholder="docker run -d -p 80:80 --name web nginx:alpine"
            rows={10}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 font-mono text-xs text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:bg-white focus:outline-none transition-all resize-y"
          />
          <Button onClick={handleConvert} variant="primary" size="sm" className="w-full sm:w-auto mt-2">
            Convert to Compose <ArrowRight size={14} />
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              docker-compose.yml Output
            </label>
            <span className="text-[11px] text-[var(--color-muted)]">Docker Compose v3+ format</span>
          </div>
          <div className="relative group">
            <pre className="min-h-[220px] max-h-[500px] overflow-auto rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 font-mono text-xs text-[var(--color-ink)] leading-relaxed">
              {composeYaml || <span className="text-[var(--color-muted)] italic"># Output YAML will appear here...</span>}
            </pre>
            {composeYaml && <CopyButton text={composeYaml} />}
          </div>
        </div>
      </div>
    </div>
  )
}
