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
      const errorData = await response.text();
      console.error(`Error from backend API: ${response.status} - ${errorData}`);
      throw new Error(`Failed to fetch job tracking data: ${response.statusText}`);
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