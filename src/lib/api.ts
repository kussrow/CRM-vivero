import { supabase } from "./supabaseClient";
import { mockProducts, mockCategories } from "../data/mockData";

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
};

export type Category = {
  id: string;
  name: string;
};

export async function fetchProducts(): Promise<Product[]> {
  // Simulating API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts as Product[]), 300);
  });
}

export async function fetchCategories(): Promise<Category[]> {
  // Simulating API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories as Category[]), 300);
  });
}

export async function createCategory(name: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("product_categories")
    .insert([{ name, active: true }])
    .select("id, name")
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return null;
  }
  return data as Category;
}
