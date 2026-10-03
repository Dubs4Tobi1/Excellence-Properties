# Excellence Properties

Standalone property website built with **React + JSX + Vite**. It does not depend on the existing Excellence Properties repository or its original `properties` table schema.

## Included

- White and warm gold Excellence Properties home page.
- Dedicated Zylus Homes and Blue Earth Properties pages.
- WhatsApp inquiry buttons to **08033354167**, prefilled with the listing name.
- Responsive property cards and partner routes.
- Authenticated `/admin` listing dashboard for details, photos and videos.
- Supabase migration using isolated `ep_*` tables and an `ep-property-media` Storage bucket, with row-level security.
- Supplied property advertisements and video in `public/images/`.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

The example is pre-filled for the connected Excellence Supabase project. Keep those values in `.env` for this project. Never put a secret/service-role key in a Vite variable.

## Set up Supabase

1. Open the Supabase SQL editor and run `supabase/migrations/001_initial.sql`.
2. Create the admin login in Supabase **Authentication → Users**.
3. Sign in at `/admin`. The dashboard will show a ready-to-copy SQL statement using your email to grant the admin role. Run it in the Supabase SQL editor, then sign out and sign in again.
4. Upload JPEG, PNG, WebP or AVIF images and MP4, WebM or QuickTime videos. Each file can be up to 50 MB. Public pages query only published listings.

The migration leaves the existing `properties`, `profiles`, and related tables untouched. The app's new tables are `ep_properties`, `ep_property_media`, and `ep_user_roles`. Database writes and uploads require a signed-in user whose UUID has an `admin` role.

## Build

```bash
npm run build
```
