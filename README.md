# Ahatab Foundation

Website for Ahatab Foundation, Faridpur, Bangladesh. *Extending hands to those who need it most.*

Static site (plain HTML, CSS and ES modules, no build step) with [Supabase](https://supabase.com) for content, forms, admin login and photo storage. English and Bangla.

## Pages

Every page is a folder with an `index.html`, so the address bar shows clean names.

| Address | What it is |
| --- | --- |
| `/home/` | Home (the site root redirects here) |
| `/about/` | About us |
| `/programs/` | What we do |
| `/news/` | News and stories (`/news/?s=<slug>` opens one story) |
| `/events/` | Events, upcoming and past |
| `/donate/` | Donate (amount, payment method, Transaction ID) |
| `/volunteer/` | Volunteer form and sharing |
| `/contact/` | Contact |
| `/admin/` | Admin dashboard |

**Navigation.** On desktop (1120px and wider) the topics, the BN/English switch and Donate sit in the top bar. On tablets and phones they move into a compact menu drawer (3-line button). On the phone the admin has an app-style bottom bar (Home, Visitors, Gifts, Inbox, More).

**Language.** Visitors whose device time zone is Bangladesh (Asia/Dhaka) get Bangla first; everyone else gets English. A visitor's own choice is remembered. A short (about one second) logo animation plays once per visit and is skipped when the device asks for reduced motion.

**Speed.** The Supabase library loads in the background (`js/supa.js`), so the header, hero and animation appear immediately and data fills in as it arrives.

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

## Donations

The Donate page walks a visitor through: amount, payment method (bKash, Nagad, Rocket, Upay and so on, taken from **Settings → Ways to give**), then a "send money" step showing your number with a Copy button and a 10-minute reminder timer, and finally the Transaction ID. The gift arrives under **Admin → Gifts** as *pending*. Check it against your real account, then press **Confirm gift** (or **Reject**). Only confirmed gifts count toward "confirmed gifts so far" on the Overview.

This is a manual flow: the site cannot see your bKash or Nagad account. Automatic confirmation needs a merchant payment gateway (for example SSLCommerz, bKash merchant API or a gateway like Deshi Pay) plus a Supabase Edge Function that receives the gateway's callback and marks the gift verified.

## Site pictures

Each public page shows a built-in original illustration (`images/art/`). In **Admin → Settings → Site pictures** you can replace any of the ten slots with an uploaded photo or a link, or reset it. Please upload photos of people, and above all of children, only with their (or their guardians') agreement.

## Deploy

GitHub Pages: publish the `main` branch root. The site works under a project sub-path such as `/ahatabfoundation/`. `404.html` sends lost visitors to `/home/`. Because pages are folders, old `.html` addresses (`stories.html`, `get-involved.html`) no longer exist.

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
