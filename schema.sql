-- EverAfter Memories: run this once in Supabase > SQL Editor.
-- Rule: guests can only SEND. Only the couple's logged-in account can READ or DELETE.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 1 and 60),
  place text check (char_length(place) <= 60),
  relation text check (char_length(relation) <= 30),
  message text check (char_length(message) <= 500),
  caption text check (char_length(caption) <= 200),
  kind text not null check (kind in ('text','video','photo')),
  file_path text,
  created_at timestamptz default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 1 and 60),
  phone text check (char_length(phone) <= 20),
  attending text check (char_length(attending) <= 40),
  guests text check (char_length(guests) <= 4),
  created_at timestamptz default now()
);

alter table public.events enable row level security;
alter table public.wishes enable row level security;
alter table public.rsvps  enable row level security;

-- Only the owner (the couple) can read their own event, wishes and RSVPs.
create policy "owner reads event"  on public.events for select using (owner_id = auth.uid());
create policy "owner reads wishes" on public.wishes for select
  using (exists (select 1 from public.events e where e.id = event_id and e.owner_id = auth.uid()));
create policy "owner deletes wishes" on public.wishes for delete
  using (exists (select 1 from public.events e where e.id = event_id and e.owner_id = auth.uid()));
create policy "owner reads rsvps" on public.rsvps for select
  using (exists (select 1 from public.events e where e.id = event_id and e.owner_id = auth.uid()));
-- No insert/update policies: guests cannot write tables directly. They use the functions below.

create function public.submit_wish(
  p_slug text, p_name text, p_place text, p_relation text, p_message text,
  p_caption text, p_kind text, p_file_path text
) returns void language plpgsql security definer set search_path = public as $$
declare v_event uuid;
begin
  select id into v_event from events where slug = p_slug;
  if v_event is null then raise exception 'unknown event'; end if;
  if p_kind = 'text' and coalesce(trim(p_message), '') = '' then raise exception 'message required'; end if;
  if p_kind <> 'text' and (p_file_path is null or left(p_file_path, length(p_slug) + 1) <> p_slug || '/') then
    raise exception 'bad file path';
  end if;
  insert into wishes (event_id, guest_name, place, relation, message, caption, kind, file_path)
  values (v_event, trim(p_name), nullif(trim(p_place), ''), p_relation, nullif(trim(p_message), ''),
          nullif(trim(p_caption), ''), p_kind, p_file_path);
end $$;

create function public.submit_rsvp(
  p_slug text, p_name text, p_phone text, p_attending text, p_guests text
) returns void language plpgsql security definer set search_path = public as $$
declare v_event uuid;
begin
  select id into v_event from events where slug = p_slug;
  if v_event is null then raise exception 'unknown event'; end if;
  insert into rsvps (event_id, guest_name, phone, attending, guests)
  values (v_event, trim(p_name), trim(p_phone), p_attending, p_guests);
end $$;

revoke all on function public.submit_wish(text,text,text,text,text,text,text,text) from public;
revoke all on function public.submit_rsvp(text,text,text,text,text) from public;
grant execute on function public.submit_wish(text,text,text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.submit_rsvp(text,text,text,text,text) to anon, authenticated;

-- Private storage bucket: 25 MB limit, photos and videos only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-media', 'guest-media', false, 26214400,
  array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime'])
on conflict (id) do nothing;

create function public.slug_exists(s text) returns boolean
language sql security definer set search_path = public as
$$ select exists (select 1 from events where slug = s) $$;
grant execute on function public.slug_exists(text) to anon, authenticated;

-- Guests may upload into an existing event folder. They cannot list, read or delete files.
create policy "guests upload media" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'guest-media' and public.slug_exists((storage.foldername(name))[1]));

-- Only the event owner can read or delete that event's files.
create policy "owner reads media" on storage.objects for select to authenticated
  using (bucket_id = 'guest-media' and exists (
    select 1 from public.events e where e.slug = (storage.foldername(name))[1] and e.owner_id = auth.uid()));
create policy "owner deletes media" on storage.objects for delete to authenticated
  using (bucket_id = 'guest-media' and exists (
    select 1 from public.events e where e.slug = (storage.foldername(name))[1] and e.owner_id = auth.uid()));

-- AFTER creating the couple's user (Authentication > Users), run once per client:
-- insert into public.events (slug, title, owner_id)
-- values ('rohan-priya', 'Rohan & Priya', '<paste the couple user UUID here>');
