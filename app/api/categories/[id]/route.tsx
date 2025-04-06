import { NextResponse } from "next/server";
import { deleteCategory, getCategoryById, updateCategory } from "@/services/category";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  return NextResponse.json(category);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await request.json();
  const updatedCategory = await updateCategory(id, category);
  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deletedCategory = await deleteCategory(id);
  return NextResponse.json(deletedCategory);
}
