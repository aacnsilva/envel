import { NextResponse } from "next/server";
import { deleteCategory, getCategoryById, updateCategory } from "@/services/category";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);
  return NextResponse.json(category);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const category = await request.json();
  const updatedCategory = await updateCategory(params.id, category);
  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const deletedCategory = await deleteCategory(params.id);
  return NextResponse.json(deletedCategory);
}
