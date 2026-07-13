# HDPTH Static Internationalization

This project uses a static i18n generation workflow that is equivalent in output to a framework i18n layer for SEO purposes:

- Real crawlable language URLs are generated under `/en`, `/es`, `/ru`, `/ar`, `/fr`, `/pt`, and `/zh`.
- Each localized page has its own `<html lang>`, `dir`, SEO title, meta description, H1, canonical URL, image alt prefix, and hreflang cluster.
- Arabic pages use `dir="rtl"` and RTL CSS rules.
- The language switcher is injected into each generated page.
- `sitemap.xml` is regenerated with all language URLs.

## Commands

```bash
npm run i18n:build
npm run build
```

`npm run build` automatically runs the i18n generator through `scripts/sync-public.mjs` before syncing files into `public/`.

## Dictionary files

Generated translation dictionaries live in:

```text
i18n/messages/en.json
i18n/messages/es.json
i18n/messages/ru.json
i18n/messages/ar.json
i18n/messages/fr.json
i18n/messages/pt.json
i18n/messages/zh.json
```

## Translation API placeholders

The message JSON files reserve these environment variables for future API-backed regeneration:

```text
DEEPL_API_KEY
GOOGLE_CLOUD_TRANSLATION_API_KEY
```

Do not use browser auto-translation as indexable SEO content.
