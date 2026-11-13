# Ahatab Foundation

Website for Ahatab Foundation, Faridpur, Bangladesh. *Extending hands to those who need it most.*

Static site (plain HTML, CSS and ES modules, no build step) with [Supabase](https://supabase.com) for content, forms, admin login and photo storage. English and Bangla.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About us | `about.html` |
| What we do | `programs.html` |
| News, stories and events | `stories.html` |
| Donate and volunteer | `get-involved.html` |
| Contact | `contact.html` |
| Admin dashboard | `admin/index.html` |

## First-time admin setup

1. Open `/admin/` on the live site and choose **Create the first admin account**.
2. Confirm the email Supabase sends, then sign in.
3. Choose **Claim admin access**. This works once; later admins are added in the database.
4. In the Supabase dashboard, turn public sign-ups off (Authentication, Sign In / Providers) so nobody else can create accounts.
5. Open **Settings** and add the public email, phone, Facebook page and payment methods.

Visitors never see unpublished content, gifts, volunteers or messages: Row Level Security in `supabase/schema.sql` enforces that in the database, not in the page.

## Run locally

Any static server works:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Import the repository in Vercel (or Netlify, Cloudflare Pages) as a static site: no build command, output directory is the repository root.

## Configuration

`js/config.js` holds the Supabase URL and publishable key. The publishable key is meant for browsers; access is controlled by the Row Level Security policies.

## Editing the look

Colors, type and spacing are CSS variables at the top of `css/site.css`. The design idea is nakshi kantha: patches of cloth held together by a running stitch.
