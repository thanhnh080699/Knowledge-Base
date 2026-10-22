# Production deployment

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
