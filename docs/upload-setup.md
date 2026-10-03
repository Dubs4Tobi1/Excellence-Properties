# Property upload setup and review

## Confirmed production blockers

On 3 October 2026 the project recovered to ACTIVE_HEALTHY. It has no storage buckets,
no Auth users, and no property records. The properties table is missing the category,
location and media columns used by the frontend. All eight public tables have RLS disabled.

The migration `supabase/migrations/20261003181944_property_media_and_access.sql`
is prepared but NOT APPLIED. Automatic approval review rejected production execution
because it creates a public media bucket and changes schema/access rules across eight tables.
Obtain explicit approval for this exact migration before applying it. Do not merge/deploy
this frontend without the database setup; the new upload payload requires owner_id.

## Migration behavior

- Adds missing property fields and an owner_id referencing Auth users.
- Creates property-images, a public bucket for listing photos/video tours with a 50 MiB limit.
- Allows JPG, PNG, WebP, MP4 and WebM. Public means anyone with a media URL can retrieve it.
- Enables RLS for all eight public tables. Property/reference data stays publicly readable.
- Requires a server-managed app_metadata.role of agent to create properties or upload media.
- Limits property updates/deletes and image inserts/deletes to the property owner.
- Media paths are properties/<auth-user-id>/<property-id>/<unique-file-name>.
- Profiles/favorites are only readable by their owners. Messages have no client policies.
- Existing ownerless properties stay readable; an administrator must assign ownership before editing.

## Agent account required

Create the intended agent account in Supabase Authentication using Add user. No account
has been created or invitation sent by this change. Grant the agent role from a trusted
administrator context, never via user_metadata or a browser client. For example, after
confirming the actual account email, run in the SQL editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"agent"}'::jsonb
where email = 'REPLACE_WITH_CONFIRMED_AGENT_EMAIL';
```

Then sign out/in to refresh the JWT and use Agent sign in on /upload.
Never place a service_role or secret key in VITE_ environment variables.

## Deployment

Use Node 22.12+ and the committed lockfile. Configure VITE_SUPABASE_URL and
VITE_SUPABASE_ANON_KEY (a publishable or legacy anon key). The existing project fallback
is retained for compatibility. VITE_PROPERTY_MEDIA_BUCKET is optional and defaults to
property-images; a custom bucket requires matching MIME limits and ownership policies.
Netlify's SPA rewrite allows direct navigation to property and upload URLs.

## Validation

Run npm ci, npm run check, npm test and npm run build. Unit tests use mocked Supabase/TUS
responses; they do not prove that live storage policies work. Browser QA could not run here
because Chromium could not be downloaded. After approved migration/account setup, verify
an actual MP4 larger than 6 MiB, a small photo, a deliberately rejected format, public playback,
a failed publication cleanup, and rejection of anonymous/non-agent uploads.

Large uploads retry interrupted chunks while this page remains open. Reload recovery across
new publishing attempts is not implemented. Failed cleanup reports the property reference.
The upload workflow compensates failures rather than using a database transaction.
