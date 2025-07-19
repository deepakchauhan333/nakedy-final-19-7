import { NextResponse } from 'next/server';
import { getFastCategories } from '@/lib/supabase-fast';

export async function GET() {
  try {
    const categories = await getFastCategories();

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}