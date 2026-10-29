# Production deployment

## Mobile homepage release (2026-10-29, current)

- User authorized commit/push and production deployment of mobile loading optimizations and the responsive discovery scene. Source commit: `4cb9490` on `codex/home-scroll-mobile`.
- Verified `web-srv` through `192.168.12.102`; both production IPs identify the same host. Updated frontend only. Only `thanhnh.id.vn-fe` restarted; API/CMS/CDN PIDs and restart counts were unchanged. No migration or database changes; production `.env` remained byte-identical.
- Under 900 px, the workspace discovery scene uses three separate horizontal rows revealed vertically. Wide desktop keeps its original fan animation. Narrow viewports at most 560 px tall use normal scrolling without pinning. Top Repos retains its original featured/related layout; rejected deck/gallery experiments are not deployed.
- Production has runtime, scoped Tailwind sources, reading/tool CSS and header changes beyond the Git baseline. Preserve those differences; this release deployed only scoped homepage/motion/mascot files and two new sprites, not the whole checkout.
- Build ID: `G3T56v8E4wfKiyUOYab1D`. Rollback: `/home/deploy-backups/thanhnh-home-mobile-20261029-4cb9490/rollback.sh`; backup archive `fe-before.tar.gz`, original build `previous-next`. Root-only backup directory. Old static assets were retained for cached pages.
- Candidate production build and 2 static-delivery tests passed; candidate/public browser checks passed for mobile, tablet, desktop, landscape and breakpoint resize. Public canonical, all 7 original Top Repos articles, RSS (226 items), sitemap (320 URLs), routes and API health passed. See `fe/docs/deployment-home-mobile-2026-10-29.md` for Lighthouse public results.

## Homepage storytelling release (2026-10-29, current)

- User authorized the new homepage, code commit/push and production deployment. Hero, narrative sections, GSAP scroll transitions and the right-aligned cat mascot are live at `https://thanhnh.id.vn/`.
- Tools uses a natural-height section with the introduction above a wide JSON input/output demonstration. Do not restore the previous pinned two-column Tools section with large vertical whitespace.
- Released frontend only on verified `web-srv` through `192.168.11.126`, preserving production runtime, newer tools, original Top Repos articles, RSS and sitemap. Only `thanhnh.id.vn-fe` restarted; no database changes.
- Rollback: `/home/deploy-backups/thanhnh-home-story-20261029/fe-before.tar.gz` and `previous-next` restore the pre-homepage release. `previous-next-merged` and `post-view-tracker-before.tsx` preserve the state before the final tracker integration.
- Production build, static-delivery tests, desktop/mobile/tablet checks, canonical, 7 Top Repos articles, RSS, sitemap and API health passed. All four application PM2 processes are online. Local TypeScript passed for API/CMS/FE and all 20 reading/feed tests passed. API integration tests were blocked by an existing SQLite-incompatible users migration; do not claim they passed.

## Top Repos articles replace GitHub discovery (2026-10-28, current)

- Search follow-up: `/repos?q=...` filters the original articles by title, excerpt and tags, with case/accent-insensitive matching, submit and clear controls, result count and an empty state. Existing article details remain unchanged. Backup: `/home/deploy-backups/thanhnh-top-repos-search-20261028/fe-before.tar.gz`; previous build: `previous-next`. Scoped lint/build and production browser checks passed, including mobile layouts, query reload and canonical.

- User requested the original Top Repos articles instead of the GitHub catalog and README detail pages, and explicitly chose all **7** existing published articles (IDs 222–228, including MacViewer).
- `/repos` now uses the existing article cards and links directly to `/docs/top-repos/:slug`. Article content, original detail renderer and canonical URLs are unchanged. Use the category API for future articles; do not reintroduce the GitHub discovery UI without a new request.
- Removed GitHub filtering, catalog/snapshot services, README renderer and `/repos/:owner/:name` routes. Removed their URLs from the sitemap; original article URLs remain.
- Frontend-only release on verified `web-srv`; rollback archive: `/home/deploy-backups/thanhnh-top-repos-articles-20261028/fe-before.tar.gz`, previous build: `previous-next` in that directory. Production browser checks confirmed all 7 articles, original reader/canonical, desktop/mobile, old README route 404 and sitemap cleanup.
- Earlier discovery/detail release records below are historical and superseded by this release.

## Repository discovery release (2026-10-28)

- Follow-up detail release: repository titles and “Xem chi tiết” open `/repos/:owner/:name`, using the documentation reader layout with original README, TOC and reading controls. Filters/view/page survive return navigation. README Markdown skips raw HTML and resolves source-relative links/images; do not send untrusted README through `PostContent`'s raw HTML branch.
- Detail release rollback: `/home/deploy-backups/thanhnh-repo-details-20261028/fe-before.tar.gz` and `previous-next`. Only FE restarted; production detail/reader/mobile/404/canonical/sitemap checks passed. Notes: `artifacts/repo-details-release/release-notes.md`.

- Deployed `https://thanhnh.id.vn/repos` as the main-menu “Khám phá Repo” directory on verified `web-srv` via `192.168.11.126`. Frontend only; no database changes.
- GitHub data: up to 40 repositories per topic (`devops`, `developer-tools`, `self-hosted`), above 1,000 stars, excluding forks and archived repositories; initial deduplicated snapshot has 114 repos. Fetches are cached for 3,600 seconds with a timestamped bundled fallback. “Top Repos” sorts by total stars, not historical growth.
- Preserved the concurrent mobile navigation fix. Header and mobile menu use the `lg` breakpoint; production global Tailwind sources include `mobile-navigation.tsx`. Repository utilities are scoped in `fe/src/app/repos/repos.css`.
- Latest rollback archive: `/home/deploy-backups/thanhnh-repos-20261028/fe-predeploy-current.tar.gz`; previous build: `previous-next` in the same directory. Earlier `fe-before.tar.gz` predates the mobile menu fix; prefer the latest archive.
- Production browser checks passed for search, combined filters, URL reload, sorting, pagination, responsive layout, canonical and sitemap. RSS, public routes and API health returned HTTP 200; all four application PM2 processes remained online. Release details: `artifacts/repos-release/release-notes.md`.

## Post views release and Windows authentication (2026-10-27)

- Deployed post viewer details (IP, approximate location, browser/OS/device, referrer domain and timestamp) to verified `web-srv` via `192.168.11.126`. Both production IPs belong to this same host.
- Windows SSH password is stored in Windows Credential Manager as generic target `thanhnh.id.vn.production.ssh`, account `ubuntu`. Retrieve into process memory only; never print it or put it in arguments/files. The local helper `scratch/production_access.py` supports Credential Manager backed SSH with known-host verification.
- Feature backup: `/home/deploy-backups/thanhnh-post-views-20261027/` contains the original application archive, restricted SQL dump and previous API/CMS/FE builds. Keep these for rollback.
- Verified nginx ingress for the API is `192.168.12.100`. `POST_VIEWS_TRUSTED_PROXY_IPS` configures exact trusted peers; viewer tracking uses the rightmost `X-Forwarded-For` address only from trusted ingress, falling back to `X-Real-IP`. Do not trust all proxies or client-supplied prefixes.
- API migration `1793000000000_create_post_views_table` adds the history table. Existing view totals are preserved; detailed history starts at release. Per-post IP/user-agent deduplication uses fixed 30-minute buckets, not unique people.
- Detailed history is available only at authenticated `GET /api/admin/posts/:id/views` with `posts.manage`. Public recording retains `/api/posts/:id/view` compatibility; `/api/posts/:id/views` is also accepted.

- SSH user: `ubuntu`.
- Server IPs: `192.168.12.102` or `192.168.11.126`; use whichever is reachable and verify hostname and application path before deploying. Do not deploy separately to both without confirming they are distinct targets.
- Application root: `/home/thanhnh.id.vn`.
- PM2 processes: `thanhnh.id.vn-api`, `thanhnh.id.vn-cms`, `thanhnh.id.vn-cdn`, `thanhnh.id.vn-fe`.
- Credentials must be supplied securely at deployment time. Never commit passwords, private keys or production `.env` files.
- Preserve server environment files and uploaded media. Back up changed files and the database before migrations. Build with production environment values, never fixture API settings.
- Deploy API schema/code before dependent FE/CMS. Restart only changed processes. CDN does not need restarting for frontend/content-only changes.
- Current production baseline after rollback: commit `e6d2d52`. The editorial redesign was rejected and rolled back on 2026-10-19; do not reapply it without a new user request.
- Verify PM2 state, public routes, canonical URLs, sitemap, RSS and API health after release. Keep backups available for rollback.

## Verified server runtime (2026-10-19)

- Active host verified: `192.168.12.102` (`web-srv`). Application files and PM2 daemon are owned by `root`; SSH as `ubuntu`, then use passwordless `sudo -n` for application operations.
- PM2 home: `/root/.pm2`. Runtime binaries: `/root/.nvm/versions/node/v24.15.0/bin`; supply this directory in `PATH` for builds and PM2 commands.
- API PM2 command: `node build/bin/server.js`, working directory `api`; copy `api/.env` into `api/build/.env` after `node ace build`.
- FE and CMS PM2 command: `yarn start`, in their respective directories. Build FE with `NEXT_PUBLIC_SITE_URL=https://thanhnh.id.vn` and the existing server `.env`. Public API base: `https://api.thanhnh.id.vn/api`.
- Backup for the editorial release: `/home/deploy-backups/thanhnh-editorial-20261019/` (application archive and SQL dump). Restrict access; SQL backups contain private application data.

## Rollback record (2026-10-19)

- Restored application source and API/FE/CMS builds from `/home/deploy-backups/thanhnh-editorial-20261019/app-before.tar.gz`.
- Preserved current database; no SQL restore or destructive migration rollback. Editorial drafts remain unpublished.
- Rejected release backup: `/home/deploy-backups/thanhnh-editorial-rejected-20261019/app.tar.gz`.

## Local deployment authentication

- Use the dedicated SSH identity `~/.ssh/thanhnh_production` (configured in `~/.ssh/config` for the production IPs). Its public key is authorized for `ubuntu` on verified host `192.168.12.102`.
- If the agent is empty, run `ssh-add ~/.ssh/thanhnh_production`. Never store the production password in this file or Git.

## Production content API and credentials

- Production origin: `https://api.thanhnh.id.vn`; API base: `https://api.thanhnh.id.vn/api`.
- Authenticate automation requests with the `x-api-token` header. Keep the token only in macOS Keychain: service `thanhnh.id.vn.production.content-api`, account `content-automation`.
- Retrieve the token programmatically with `/usr/bin/security find-generic-password -s thanhnh.id.vn.production.content-api -a content-automation -w`, capturing stdout directly into process memory. Never run this command with uncaptured output, echo the token, include it in prompts, command-line arguments, request logs, Git, or repository files. Send requests through an HTTP library with the header held in memory; disable HTTP debug logging.
- Load secrets only for requests to the verified production API origin. Do not forward the credential to CDN URLs, source links, or cross-origin redirects.
- Posts: `GET/POST /automation/posts`, `GET/PUT /automation/posts/:id` relative to the API base. Required scopes are `posts.read`, `posts.create`, and `posts.update` for the editorial workflow.
- Upload images with `POST /automation/media/upload` using multipart field `file` and optional `folder`; requires `media.create`. Use the returned media path/URL as expected by the existing post renderer.
- Reuse the existing Help Desk category (`categoryId=2`, slug `help-desk`); verify it and existing posts before writing. Check slugs before retrying interrupted creates so retries do not duplicate posts.
- Prepare each post with `title`, unique `slug`, HTML `content`, `excerpt`, `metaTitle`, `metaDescription`, `focusKeyword`, `canonicalUrl`, `coverImage`, and `categoryId`. Start with `status=DRAFT`, then update to `PUBLISHED` with the actual ISO publication timestamp only after quality checks pass and publication is authorized by the user.
- This API's public post endpoints currently do not enforce a published-only filter. Treat drafts as potentially publicly retrievable: finish editorial and media QA locally before submitting a draft; never put credentials, private review notes, or unfinished confidential material in it.
- Before mutating an existing post, retain its original API payload for rollback without secrets. For new content, record created IDs, slugs and uploaded asset paths. A failed quality check must leave the post unpublished; do not delete unrelated content or media.
- Content-only work does not require schema changes, application deployment, or PM2 restarts. Report existing canonical, sitemap or RSS defects separately instead of changing application code without scope.

## Editorial standards for Help Desk articles

- Write in Vietnamese for office users and IT Help Desk staff. Use an approachable, technically precise, evidence-based voice with depth where the topic requires it.
- Vary sentence length, syntax, paragraph length and openings naturally. Use active or passive voice according to emphasis; avoid repetitive transitions, mechanical citation patterns, grammatical templates and filler phrases.
- Use cautious wording where evidence is conditional. State prerequisites, supported operating-system versions, limitations and exceptions rather than presenting context-dependent advice as universally true.
- Explain mechanisms and the diagnostic reasoning behind steps. Use relevant conceptual frameworks and examine alternative explanations or tradeoffs; include scholarly debates or competing interpretations only when they genuinely clarify the subject, not as invented controversy.
- Use correct specialist terminology and define unfamiliar concepts. Distinguish sourced conclusions, technical explanations, hypothetical scenarios and actual observations. Never invent testing, personal experience, quotations, references or statistics.
- Research current Microsoft documentation and relevant manufacturer documentation. Link directly to primary sources supporting the associated instruction and integrate citations into the discussion naturally. Do not copy lengthy passages.
- Avoid em dashes (U+2014), vague generalizations, stock AI phrases, exaggerated certainty, keyword stuffing and claims about bypassing AI detectors. Optimize for accuracy, originality, readability and useful reasoning.
- Troubleshooting articles should cover symptoms, causes, low-impact checks before advanced fixes, expected results, confirmation of recovery, and when/how to escalate to IT. Explain the concrete effect of disruptive steps, especially connection resets and clearing print queues, at the step itself.
- Aim for 1,500–2,000 Vietnamese words per article while prioritizing usefulness over length. Use H2/H3 headings, ordered steps, concise lists, and command blocks where appropriate; avoid duplicating the page's H1 inside the body.
- Provide a unique excerpt, focus keyword, readable slug, canonical URL matching the actual public route, SEO title around 50–60 characters and meta description around 140–160 characters, allowing natural phrasing over rigid counts.
- Each article needs one original 16:9 cover generated with ImageGen and two informative in-body images: a diagnostic flowchart and a technical illustration. Generated illustrations must not be presented as real Windows screenshots or evidence of tests.
- Optimize images as WebP with descriptive filenames, Vietnamese alt text and captions. Use ImageGen for raster illustrations; produce exact labeled diagrams with deterministic drawing tools. Verify readability and technical correctness before upload.
- Verify metadata, sources, commands, headings/table of contents, links, all three images, and desktop/mobile rendering. Confirm public URLs, publication status, canonical output and sitemap after publishing. Keep any article that fails checks unpublished and report the reason.

### Credential verification (2026-10-20)

- The stored content token successfully accessed `GET /api/automation/posts` (HTTP 200).
- `GET /api/automation/media` returned HTTP 403, `Insufficient token permissions`; `media.read` is not granted. Do not assume this proves upload access: check the required `media.create` scope when uploading. If a required scope is missing, report the specific blocked capability rather than silently expanding the token's permissions.

## Windows content automation credential (2026-10-28)

- User explicitly authorized storing the supplied production content API token on this Windows machine. It is saved in Windows Credential Manager, generic target `thanhnh.id.vn.production.content-api`, account `content-automation`. Use this on Windows instead of asking for the token again or requiring macOS Keychain.
- `scratch/content_api_access.py` reads the credential into memory only and provides `request(path, method, data, headers)` restricted to `https://api.thanhnh.id.vn/api/` with redirects rejected. Run `python scratch/content_api_access.py verify` for a read-only check. Never print/read the secret to tool output, put it in arguments/files, or forward it to CDN/source URLs. Do not commit the token.
