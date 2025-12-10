-- Create a secure view for public organization profiles
create or replace view public_org_profiles as
select
    id as org_id,
    slug,
    name,
    logo_url,
    background_image_url,
    primary_color,
    secondary_color,
    is_open
from orgs
where is_active = true;

-- Grant access to the view
grant select on public_org_profiles to anon, authenticated;

-- Ensure RLS is enabled on the underlying table (it should be already, but good to reinforce)
alter table orgs enable row level security;

-- Note: Views in Supabase/Postgres bypass RLS of the underlying table if the user has permission to read the view 
-- AND the view is defined with 'security definer' or owned by a sufficiently privileged role.
-- By default, a simple view runs with the permissions of the invoker.
-- HOWEVER, if the invoker (anon) cannot read 'orgs', they cannot read the view either unless we change ownership or use security definer.
-- BETTER APPROACH: Use a SECURITY DEFINER function or ownership chaining.
-- Actually, simpler: Grant SELECT on the view. The view owner is usually postgres/admin.
-- If the view owner has access to 'orgs', and we grant SELECT on view to anon, anon can read it.
-- Let's check ownership. Usually migrations run as postgres/superuser.

alter view public_org_profiles owner to postgres;
