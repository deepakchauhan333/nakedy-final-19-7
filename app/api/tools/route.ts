import { NextRequest, NextResponse } from 'next/server';
import { getFastTools } from '@/lib/supabase-fast';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    
    const tools = await getFastTools(limit);
    
    // Filter by category if provided
    const filteredTools = category 
      ? tools.filter(tool => tool.category === category)
      : tools;

    return NextResponse.json({
      success: true,
      data: filteredTools,
      count: filteredTools.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}