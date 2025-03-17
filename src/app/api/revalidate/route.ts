import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to handle revalidation requests
 * Can be called from client-side to refresh the cache
 */
export async function POST(request: NextRequest) {
  try {
    // Revalidate the pattern and section data
    revalidateTag('patterns');
    revalidateTag('sections');
    
    return NextResponse.json({ 
      revalidated: true,
      message: 'Pattern data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { 
        revalidated: false, 
        message: 'Failed to refresh pattern data',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
