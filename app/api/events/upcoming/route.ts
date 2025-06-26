import { NextResponse } from 'next/server';

export async function GET() {
  // Ensure the backend URL is configured in your environment variables
  const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080';

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/events/upcoming`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // We use 'no-store' to ensure we always get the latest data
      cache: 'no-store', 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from backend:", errorText);
      return NextResponse.json(
        { error: `Failed to fetch from backend: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
} 