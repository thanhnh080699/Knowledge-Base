# Bundled fonts

Inter (weights 400–700, optical size 14) and EB Garamond (400) are
self-hosted through next/font/local. Mobile body text uses the platform font;
desktop keeps Inter. EB Garamond stays on display headings at both sizes. Font sources are the Google Fonts upstream
repository; each family retains its SIL Open Font License beside the WOFF2 file.

These derivatives were generated on 2026-10-28 using FontTools. They retain
Latin, combining accents, Vietnamese, punctuation, currencies and common symbols.
Other scripts use the configured system fallback. Font files are bundled so
production builds do not depend on Google Fonts availability.

To regenerate in a Python environment with `fonttools[woff]` installed, run
`python scripts/build-fonts.py` from fe. Review the output before committing:
upstream source URLs follow the Google Fonts main branch and can change.
