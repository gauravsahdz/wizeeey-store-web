import { NextResponse } from "next/server";
import { getCategories } from '@/services/api';

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json({ categories: data });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 