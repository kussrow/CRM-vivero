// ─── Core Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'seller';
  phone?: string;
  avatar_url?: string;
  status?: 'pending' | 'active' | 'inactive';
  company_id?: string;
}

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  tax_id?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  currency?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color?: string;
  position: number;
  type?: 'open' | 'won' | 'lost';
  is_default?: boolean;
  active?: boolean;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company_name?: string;
  city: string;
  address?: string;
  notes?: string;
  source?: string;
  assigned_user_id?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  active?: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  active?: boolean;
  featured?: boolean;
  special_offer?: boolean;
  offer_price?: number;
}

export interface Lead {
  id: string;
  lead_code: string;
  contact_id?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  city: string;
  address?: string;
  source?: string;
  product_interest: string;
  product_id?: string;
  product_variant_id?: string;
  pipeline_stage_id: string;
  assigned_user_id: string;
  estimated_amount: number;
  status: 'active' | 'archived';
  probability?: number;
  next_action?: string;
  next_action_date?: string;
  notes?: string;
  condicion_pago?: string;
  cuit?: string;
  razon_social?: string;
  tipo_factura?: string;
  direccion_facturacion?: string;
  selected_product_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  budget_code: string;
  lead_id?: string;
  contact_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  issue_date: string;
  due_date?: string;
  subtotal?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  payment_method?: string;
  installments?: number;
  installment_amount?: number;
  conditions?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  created_by?: string;
  created_at?: string;
}

export interface BudgetItem {
  id: string;
  budget_id: string;
  product_id?: string;
  product_variant_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  line_total: number;
}

export interface CalendarEvent {
  id: string;
  lead_id?: string;
  contact_id?: string;
  assigned_user_id: string;
  event_type: 'call' | 'meeting' | 'technical_visit' | 'budget_send' | 'follow_up' | 'closing' | 'other';
  title: string;
  description?: string;
  due_at: string;
  result?: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  completed_at?: string;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export type LeadFormData = Omit<Lead, 'id' | 'lead_code' | 'created_at' | 'updated_at'>;
export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
export type EventFormData = Omit<CalendarEvent, 'id' | 'completed_at'>;
