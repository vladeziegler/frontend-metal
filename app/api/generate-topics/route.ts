import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    // Parse the request body to get optional custom_context
    const body = await request.json().catch(() => ({}));
    const { custom_context } = body;

    // Prepare payload for FastAPI backend
    const payload = custom_context ? { custom_context } : {};

    const response = await fetch(`${FASTAPI_BASE_URL}/pipelines/generate-meta-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error('Error from FastAPI /generate-meta-suggestions:', errorData);
      return NextResponse.json({ message: 'Failed to trigger topic generation', error: errorData.detail || 'Unknown error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Network or other error in /api/generate-topics:', error);
    // Check if error is an instance of Error to access error.message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Error triggering topic generation process', error: errorMessage }, { status: 500 });
  }
} 