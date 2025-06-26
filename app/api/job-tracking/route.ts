// Deep dive ui
import { NextResponse } from 'next/server';

// This should ideally be an environment variable
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days_old = searchParams.get('days_old') || '14'; // Default to 14 days

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/job_tracking?days_old=${days_old}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        cache: 'no-store', // Ensure we get fresh data on every request
    });

    if (!response.ok) {
      // Try to parse the error response from FastAPI
      const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
      const errorMessage = errorBody.detail || 'Unknown backend error';
      console.error(`Error from backend API [job_tracking]: ${response.status} - ${errorMessage}`);
      // Forward a more informative error to the client
      return NextResponse.json({ error: `Failed to fetch job tracking data: ${errorMessage}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in job-tracking API route:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 