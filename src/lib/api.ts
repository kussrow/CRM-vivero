import { supabase } from "./supabaseClient";
import type { Lead, LeadFormData, Product, ProductCategory } from "../types";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as ProductCategory[];
}

export async function createCategory(name: string): Promise<ProductCategory | null> {
  const { data, error } = await supabase
    .from("product_categories")
    .insert([{ name, active: true }])
    .select("id, name")
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return null;
  }
  return data as ProductCategory;
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      lead_products (
        product_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return (data || []).map(lead => ({
    ...lead,
    selected_product_ids: lead.lead_products?.map((lp: any) => lp.product_id) || []
  })) as Lead[];
}

export async function createLead(lead: any): Promise<Lead | null> {
  const { selected_product_ids, ...leadData } = lead;
  
  const { data: newLead, error } = await supabase
    .from("leads")
    .insert([leadData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (selected_product_ids && selected_product_ids.length > 0) {
    const productsToInsert = selected_product_ids.map((productId: string) => ({
      lead_id: newLead.id,
      product_id: productId
    }));

    const { error: productsError } = await supabase
      .from("lead_products")
      .insert(productsToInsert);

    if (productsError) {
      console.error("Error saving lead products:", productsError);
    }
  }

  return {
    ...newLead,
    selected_product_ids: selected_product_ids || []
  } as Lead;
}
