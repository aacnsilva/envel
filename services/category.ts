import supabase from "@/lib/supabase";
import { Category } from "@/lib/types";


export const getCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
};

export const createCategory = async (category: Category) => {
  console.log("Creating category:", category);
  const { data, error } = await supabase.from("categories").insert(category).select();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, category: Category) => {
  const { data, error } = await supabase.from("categories").update(category).eq("id", id).select();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
};

export const getCategoryById = async (id: string) => {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};
