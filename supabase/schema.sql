-- Supabase SQL Schema para CRM Comercial

create extension if not exists "pgcrypto";

-- Configuración de updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-------------------------------------------------------------------------------
-- COMPANIES
-------------------------------------------------------------------------------
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id text,
  email text,
  phone text,
  address text,
  logo_url text,
  currency text default 'ARS',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_companies_updated_at
before update on companies for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- PROFILES (Vinculado a auth.users)
-------------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  phone text,
  avatar_url text,
  role text check (role in ('admin', 'seller')) default 'seller',
  status text check (status in ('pending', 'active', 'inactive')) default 'pending',
  company_id uuid references companies(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_profiles_updated_at
before update on profiles for each row execute procedure update_updated_at_column();

-- Automáticamente crear profile cuando hay nuevo user
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'seller', 'pending');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row execute procedure handle_new_user();

-------------------------------------------------------------------------------
-- SETTINGS
-------------------------------------------------------------------------------
create table settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  key text not null,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(company_id, key)
);

create trigger update_settings_updated_at
before update on settings for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- PIPELINE STAGES
-------------------------------------------------------------------------------
create table pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  name text not null,
  color text,
  position integer not null,
  type text check (type in ('open', 'won', 'lost')) default 'open',
  is_default boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_pipeline_stages_updated_at
before update on pipeline_stages for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- CONTACTS
-------------------------------------------------------------------------------
create table contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  first_name text not null,
  last_name text,
  phone text not null,
  email text,
  company_name text,
  city text,
  address text,
  notes text,
  source text,
  assigned_user_id uuid references profiles(id),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_contacts_updated_at
before update on contacts for each row execute procedure update_updated_at_column();

create index idx_contacts_phone on contacts(phone);
create index idx_contacts_email on contacts(email);
create index idx_contacts_city on contacts(city);
create index idx_contacts_assigned on contacts(assigned_user_id);

-------------------------------------------------------------------------------
-- PRODUCT CATEGORIES
-------------------------------------------------------------------------------
create table product_categories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  name text not null,
  slug text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_product_categories_updated_at
before update on product_categories for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- PRODUCTS
-------------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  category_id uuid references product_categories(id),
  sku text not null,
  name text not null,
  description text,
  base_price numeric(14,2) default 0 check (base_price >= 0),
  stock integer default 0 check (stock >= 0),
  image_url text,
  active boolean default true,
  featured boolean default false,
  special_offer boolean default false,
  offer_price numeric(14,2) check (offer_price >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(company_id, sku)
);

create trigger update_products_updated_at
before update on products for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- PRODUCT VARIANTS
-------------------------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  product_id uuid references products(id) on delete cascade,
  sku text,
  name text not null,
  description text,
  price numeric(14,2),
  stock integer default 0,
  image_url text,
  dimensions text,
  length_m numeric(8,2),
  width_m numeric(8,2),
  depth_m numeric(8,2),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_product_variants_updated_at
before update on product_variants for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- LEADS
-------------------------------------------------------------------------------
create sequence lead_number_seq;

create table leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  lead_code text unique not null default 'LEAD-' || lpad(nextval('lead_number_seq')::text, 4, '0'),
  contact_id uuid references contacts(id),
  first_name text not null,
  last_name text,
  phone text not null,
  email text,
  city text not null,
  address text,
  source text,
  product_interest text,
  product_id uuid references products(id),
  product_variant_id uuid references product_variants(id),
  pipeline_stage_id uuid references pipeline_stages(id),
  assigned_user_id uuid references profiles(id),
  estimated_amount numeric(14,2) default 0 check (estimated_amount >= 0),
  status text check (status in ('active', 'archived')) default 'active',
  probability integer default 0 check (probability >= 0 and probability <= 100),
  next_action text,
  next_action_date timestamptz,
  notes text,
  custom_fields jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_leads_updated_at
before update on leads for each row execute procedure update_updated_at_column();

create index idx_leads_code on leads(lead_code);
create index idx_leads_company on leads(company_id);
create index idx_leads_stage on leads(pipeline_stage_id);
create index idx_leads_assigned on leads(assigned_user_id);
create index idx_leads_status on leads(status);
create index idx_leads_city on leads(city);

-------------------------------------------------------------------------------
-- BUDGETS
-------------------------------------------------------------------------------
create sequence budget_number_seq;

create table budgets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  budget_code text unique not null default 'PRES-' || lpad(nextval('budget_number_seq')::text, 4, '0'),
  lead_id uuid references leads(id),
  contact_id uuid references contacts(id),
  customer_name text not null,
  customer_email text,
  customer_phone text,
  issue_date date default current_date,
  due_date date,
  subtotal numeric(14,2) default 0,
  discount_amount numeric(14,2) default 0,
  tax_amount numeric(14,2) default 0,
  total_amount numeric(14,2) default 0 check (total_amount >= 0),
  payment_method text,
  installments integer,
  installment_amount numeric(14,2),
  conditions text,
  status text check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')) default 'draft',
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_budgets_updated_at
before update on budgets for each row execute procedure update_updated_at_column();

-------------------------------------------------------------------------------
-- BUDGET ITEMS
-------------------------------------------------------------------------------
create table budget_items (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid references budgets(id) on delete cascade,
  product_id uuid references products(id),
  product_variant_id uuid references product_variants(id),
  description text not null,
  quantity numeric(12,2) default 1,
  unit_price numeric(14,2) default 0,
  discount_percent numeric(5,2) default 0,
  line_total numeric(14,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_budget_items_updated_at
before update on budget_items for each row execute procedure update_updated_at_column();

-- Calcula line_total
create or replace function calculate_budget_item_total()
returns trigger as $$
begin
  new.line_total = (new.quantity * new.unit_price) * (1 - coalesce(new.discount_percent, 0) / 100);
  return new;
end;
$$ language plpgsql;

create trigger trg_calc_budget_item_total
before insert or update on budget_items
for each row execute procedure calculate_budget_item_total();

-- Recalcula totales de budget
create or replace function recalculate_budget_totals()
returns trigger as $$
declare
  b_id uuid;
  new_subtotal numeric;
begin
  if tg_op = 'DELETE' then
    b_id := old.budget_id;
  else
    b_id := new.budget_id;
  end if;

  select coalesce(sum(line_total), 0) into new_subtotal from budget_items where budget_id = b_id;

  update budgets 
  set subtotal = new_subtotal,
      total_amount = new_subtotal - discount_amount + tax_amount
  where id = b_id;
  
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$ language plpgsql;

create trigger trg_recalc_budget_totals
after insert or update or delete on budget_items
for each row execute procedure recalculate_budget_totals();

-------------------------------------------------------------------------------
-- EVENTS
-------------------------------------------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  lead_id uuid references leads(id) on delete cascade,
  contact_id uuid references contacts(id),
  assigned_user_id uuid references profiles(id),
  event_type text check (event_type in ('call', 'meeting', 'technical_visit', 'budget_send', 'follow_up', 'closing', 'other')),
  title text not null,
  description text,
  due_at timestamptz not null,
  result text,
  status text check (status in ('pending', 'completed', 'expired', 'cancelled')) default 'pending',
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_events_updated_at
before update on events for each row execute procedure update_updated_at_column();

create index idx_events_due on events(due_at);
create index idx_events_status on events(status);
create index idx_events_assigned on events(assigned_user_id);

-------------------------------------------------------------------------------
-- ACTIVITY LOGS
-------------------------------------------------------------------------------
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  lead_id uuid references leads(id),
  contact_id uuid references contacts(id),
  user_id uuid references profiles(id),
  action text not null,
  description text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

-- Trigger para guardar actividad cuando un lead cambia de etapa
create or replace function log_lead_stage_change()
returns trigger as $$
begin
  if (old.pipeline_stage_id is distinct from new.pipeline_stage_id) then
    insert into activity_logs (company_id, lead_id, user_id, action, description, old_value, new_value)
    values (
      new.company_id, 
      new.id, 
      new.assigned_user_id, 
      'stage_change', 
      'Lead movido a nueva etapa',
      jsonb_build_object('stage_id', old.pipeline_stage_id),
      jsonb_build_object('stage_id', new.pipeline_stage_id)
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_log_lead_stage
after update on leads
for each row execute procedure log_lead_stage_change();

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-------------------------------------------------------------------------------
-- Activación global
alter table companies enable row level security;
alter table profiles enable row level security;
alter table settings enable row level security;
alter table pipeline_stages enable row level security;
alter table contacts enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table leads enable row level security;
alter table budgets enable row level security;
alter table budget_items enable row level security;
alter table events enable row level security;
alter table activity_logs enable row level security;

-- Ejemplos de RLS (Simplificados para empezar)
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view leads of their company" on leads for select using (true);
create policy "Users can insert leads" on leads for insert with check (true);
create policy "Users can update leads" on leads for update using (true);

create policy "Users can view budgets" on budgets for select using (true);
create policy "Users can insert budgets" on budgets for insert with check (true);
create policy "Users can update budgets" on budgets for update using (true);

create policy "Users can view events" on events for select using (true);
create policy "Users can insert events" on events for insert with check (true);
create policy "Users can update events" on events for update using (true);

create policy "Users can view contacts" on contacts for select using (true);
create policy "Users can insert contacts" on contacts for insert with check (true);
create policy "Users can update contacts" on contacts for update using (true);

create policy "Users can view products" on products for select using (true);
create policy "Users can view categories" on product_categories for select using (true);

-- (Las políticas finales deben ajustarse según rol de admin/seller y company_id)
