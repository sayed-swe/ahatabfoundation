# Ahatab Foundation

Website for Ahatab Foundation, Faridpur, Bangladesh. *Extending hands to those who need it most.*

Static site (plain HTML, CSS and ES modules, no build step) with [Supabase](https://supabase.com) for content, forms, admin login and photo storage. English and Bangla.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About us | `about.html` |
| What we do | `programs.html` |
| News and stories | `stories.html` |
| Events (upcoming and past) | `events.html` |
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

## Sample content

The site ships with clearly labelled sample stories (flood and river erosion, rising prices of essentials, safe water after floods), sample events and original illustrations in `images/sample/`. Sample items show a "Sample" label to visitors. In **Admin → Overview**, use **Remove sample content** to delete them in one click. Your own stories and events are never touched.

Image fields accept an https link, a site path such as `/images/sample/volunteers.svg`, or an upload to the `media` bucket.

## Visitor analytics

Every public page records a view in `page_views` (page, device type, language, referring site, a random browser id). No IP address and no cookies. Visitors with "Do Not Track" on, crawlers and the admin area are not counted. In **Admin → Visitors** you can see views today, unique visitors, a daily chart (7, 30 or 90 days), top pages, devices, language, where visitors come from and the latest visits. Tick "Don't count my own visits" there to keep your own browser out of the numbers.

Gifts, volunteers and messages have search and **Download CSV** (opens in Excel; cells that could run as formulas are neutralised).

If a picture cannot load, the site shows a built-in illustration instead of a broken-image icon. Image paths starting with `/` are resolved against the site folder, so the site also works under a sub-path such as GitHub Pages project sites.
