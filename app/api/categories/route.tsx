import { NextResponse } from "next/server";
import { createCategory, getCategories } from "@/services/category";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const category = await request.json();
  const newCategory = await createCategory(category);
  return NextResponse.json(newCategory);
}
