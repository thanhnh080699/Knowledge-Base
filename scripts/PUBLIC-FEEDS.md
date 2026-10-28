# Public RSS and sitemap

`/rss.xml` (RSS 2.0) and `/feed.xml` (alias) contain all published articles,
with title, public URL, stable post ID, excerpt, full HTML, publication and
update dates, cover image and category. Drafts, deleted articles and future publications
are excluded. `/sitemap.xml` includes public articles, categories, projects,
tools and static pages. The page head advertises the RSS subscription URL.

Both routes use uncached API reads and `Cache-Control: no-store`. The next
request sees saved changes without a build, restart, webhook secret or cron
wait. Readers decide when to poll their subscriptions. API failure returns
503 with Retry-After, rather than publishing a successful incomplete XML.

Install `public-feeds-cron.example` as `/etc/cron.d/thanhnh-public-feeds`
(mode 0644, root owner) only after verifying the server timezone is
Asia/Ho_Chi_Minh. It runs daily at 03:15 Vietnam time. No API token is used.
The job retries HTTP errors, validates XML, compares RSS with every published
API page and sitemap, and replaces snapshots only after all checks pass.
An advisory lock prevents overlapping jobs. It never changes article content
or view counts and does not restart PM2 processes.

Manual run:

```sh
python3 /home/thanhnh.id.vn/scripts/refresh-public-feeds.py --snapshot-dir /var/lib/thanhnh-public-feeds
```

Inspect `/var/log/thanhnh-public-feeds.log` for `OK` or `ERROR`.
Snapshots live in `/var/lib/thanhnh-public-feeds/`; they are operational
copies, not served instead of live data. Install `public-feeds-logrotate.example` as `/etc/logrotate.d/thanhnh-public-feeds` (0644, root owner).
If checks fail, the job exits 1 and retains the previous snapshots. Review the
log or connect it to the deployment's alerting system; cron alone does not
guarantee email delivery. Content edited during the check may require a rerun.

Rollback: remove the cron file, restore the previous FE source and `.next`
build from the release backup, and restart only `thanhnh.id.vn-fe`.

Format reference: [RSS 2.0 specification](https://www.rssboard.org/rss-specification).
