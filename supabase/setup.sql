-- Supabase SQL Editor에서 한 번 실행하세요. 사용자별 답안만 저장합니다.
create table if not exists public.study_records (
 user_id uuid not null references auth.users(id) on delete cascade,
 record_key text not null check (length(record_key) between 1 and 160),
 answer text not null default '' check (length(answer)<=60000),
 notes text not null default '' check (length(notes)<=20000),
 status text not null default 'new' check (status in ('new','review','done')),
 updated_at timestamptz not null default now(),
 primary key (user_id,record_key)
);
alter table public.study_records enable row level security;
revoke all on public.study_records from anon;
grant select,insert,update,delete on public.study_records to authenticated;
create policy "Read own study records" on public.study_records for select to authenticated using ((select auth.uid())=user_id);
create policy "Insert own study records" on public.study_records for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own study records" on public.study_records for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own study records" on public.study_records for delete to authenticated using ((select auth.uid())=user_id);
