import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const ToolSkeleton = () => (
  <div className="animate-pulse space-y-4 py-4">
    <div className="h-6 w-48 rounded-md bg-[var(--color-surface-strong)]" />
    <div className="h-32 w-full rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)]" />
    <div className="h-10 w-32 rounded-lg bg-[var(--color-surface-strong)]" />
  </div>
)

export const toolRegistry: Record<string, ComponentType> = {
  "uuid-generator": dynamic(() => import("./uuid-generator").then((m) => m.UuidGenerator), { loading: ToolSkeleton }),
  "token-generator": dynamic(() => import("./crypto-token-generator").then((m) => m.CryptoTokenGenerator), { loading: ToolSkeleton }),
  "base64-encoder-decoder": dynamic(() => import("./base64-tool").then((m) => m.Base64Tool), { loading: ToolSkeleton }),
  "hash-generator": dynamic(() => import("./hash-generator").then((m) => m.HashGenerator), { loading: ToolSkeleton }),
  "url-encoder-decoder": dynamic(() => import("./url-encoder").then((m) => m.UrlEncoder), { loading: ToolSkeleton }),
  "html-entities": dynamic(() => import("./html-entities").then((m) => m.HtmlEntities), { loading: ToolSkeleton }),
  "password-generator": dynamic(() => import("./crypto-password-generator").then((m) => m.CryptoPasswordGenerator), { loading: ToolSkeleton }),
  "slug-generator": dynamic(() => import("./slug-generator").then((m) => m.SlugGenerator), { loading: ToolSkeleton }),
  "case-converter": dynamic(() => import("./case-converter").then((m) => m.CaseConverter), { loading: ToolSkeleton }),
  "lorem-ipsum-generator": dynamic(() => import("./lorem-ipsum").then((m) => m.LoremIpsum), { loading: ToolSkeleton }),
  "timestamp-converter": dynamic(() => import("./timestamp-converter").then((m) => m.TimestampConverter), { loading: ToolSkeleton }),
  "json-formatter": dynamic(() => import("./json-formatter").then((m) => m.JsonFormatter), { loading: ToolSkeleton }),
  "color-converter": dynamic(() => import("./color-converter").then((m) => m.ColorConverter), { loading: ToolSkeleton }),
  "jwt-decoder": dynamic(() => import("./jwt-decoder").then((m) => m.JwtDecoder), { loading: ToolSkeleton }),
  "cron-builder": dynamic(() => import("./cron-builder").then((m) => m.CronBuilder), { loading: ToolSkeleton }),
  "crypto-token-generator": dynamic(() => import("./crypto-token-generator").then((m) => m.CryptoTokenGenerator), { loading: ToolSkeleton }),
  "crypto-hash-text": dynamic(() => import("./crypto-hash-text").then((m) => m.CryptoHashText), { loading: ToolSkeleton }),
  "crypto-bcrypt": dynamic(() => import("./crypto-bcrypt").then((m) => m.CryptoBcrypt), { loading: ToolSkeleton }),
  "crypto-encrypt-decrypt": dynamic(() => import("./crypto-encrypt-decrypt").then((m) => m.CryptoEncryptDecrypt), { loading: ToolSkeleton }),
  "crypto-hmac": dynamic(() => import("./crypto-hmac").then((m) => m.CryptoHmac), { loading: ToolSkeleton }),
  "crypto-rsa-key-generator": dynamic(() => import("./crypto-rsa-key-generator").then((m) => m.CryptoRsaKeyGenerator), { loading: ToolSkeleton }),
  "crypto-password-generator": dynamic(() => import("./crypto-password-generator").then((m) => m.CryptoPasswordGenerator), { loading: ToolSkeleton }),
  "chmod-calculator": dynamic(() => import("./chmod-calculator").then((m) => m.ChmodCalculator), { loading: ToolSkeleton }),
  "xml-formatter": dynamic(() => import("./xml-formatter").then((m) => m.XmlFormatter), { loading: ToolSkeleton }),
  "sql-formatter": dynamic(() => import("./sql-formatter").then((m) => m.SqlFormatter), { loading: ToolSkeleton }),
  "date-formatter": dynamic(() => import("./date-formatter").then((m) => m.DateFormatter), { loading: ToolSkeleton }),
  "docker-run-to-docker-compose": dynamic(() => import("./docker-run-to-compose").then((m) => m.DockerRunToCompose), { loading: ToolSkeleton }),
  "ipv4-subnet-calculator": dynamic(() => import("./ipv4-subnet-calculator").then((m) => m.Ipv4SubnetCalculator), { loading: ToolSkeleton }),
  "ipv4-address-converter": dynamic(() => import("./ipv4-address-converter").then((m) => m.Ipv4AddressConverter), { loading: ToolSkeleton }),
  "ipv4-range-expander": dynamic(() => import("./ipv4-range-expander").then((m) => m.Ipv4RangeExpander), { loading: ToolSkeleton }),
  "mac-address-lookup": dynamic(() => import("./mac-address-lookup").then((m) => m.MacAddressLookup), { loading: ToolSkeleton }),
  "mac-address-generator": dynamic(() => import("./mac-address-generator").then((m) => m.MacAddressGenerator), { loading: ToolSkeleton }),
  "random-port-generator": dynamic(() => import("./random-port-generator").then((m) => m.RandomPortGenerator), { loading: ToolSkeleton }),
  "git-memo": dynamic(() => import("./git-memo").then((m) => m.GitMemo), { loading: ToolSkeleton }),
  "regex-tester": dynamic(() => import("./regex-tester").then((m) => m.RegexTester), { loading: ToolSkeleton }),
  "regex-memo": dynamic(() => import("./regex-memo").then((m) => m.RegexMemo), { loading: ToolSkeleton }),
  "url-parser": dynamic(() => import("./url-parser").then((m) => m.UrlParser), { loading: ToolSkeleton }),
  "user-agent-parser": dynamic(() => import("./user-agent-parser").then((m) => m.UserAgentParser), { loading: ToolSkeleton }),
  "http-status-codes": dynamic(() => import("./http-status-codes").then((m) => m.HttpStatusCodes), { loading: ToolSkeleton }),
  "json-diff": dynamic(() => import("./json-diff").then((m) => m.JsonDiff), { loading: ToolSkeleton }),
  "text-diff": dynamic(() => import("./text-diff").then((m) => m.TextDiff), { loading: ToolSkeleton }),
  "yaml-to-json-converter": dynamic(() => import("./yaml-json-converter").then((m) => m.YamlJsonConverter), { loading: ToolSkeleton }),
  "json-to-yaml-converter": dynamic(() => import("./yaml-json-converter").then((m) => m.YamlJsonConverter), { loading: ToolSkeleton }),
  "base64-file-converter": dynamic(() => import("./base64-file-converter").then((m) => m.Base64FileConverter), { loading: ToolSkeleton }),
  "markdown-to-html": dynamic(() => import("./markdown-to-html").then((m) => m.MarkdownToHtml), { loading: ToolSkeleton }),
  "json-to-csv": dynamic(() => import("./json-to-csv").then((m) => m.JsonToCsv), { loading: ToolSkeleton }),
  "device-information": dynamic(() => import("./device-information").then((m) => m.DeviceInformation), { loading: ToolSkeleton }),
}
