import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/meta_suggestions?limit=3`, { // Fetch a reasonable number
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      cache: 'no-store', // Ensure fresh data is fetched every time
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error('Error from FastAPI /meta_suggestions (GET):', errorData);
      return NextResponse.json({ message: 'Failed to fetch topics', error: errorData.detail || 'Unknown error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Network or other error in /api/topics (GET):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Error fetching topics', error: errorMessage }, { status: 500 });
  }
} 