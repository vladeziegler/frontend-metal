import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Ensure request is "used" asynchronously before accessing params to satisfy Next.js
  try {
    await request.text(); // Or request.json() if a body was expected and used.
  } catch {
    // Ignore error from reading body if not actually needed or empty
  }

  const { id } = await params;
  if (!id || isNaN(parseInt(id))) { // Add validation for id
    return NextResponse.json({ message: 'Valid Topic ID is required for outline generation' }, { status: 400 });
  }

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/pipelines/generate-article-outline/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error(`Error from FastAPI /pipelines/generate-article-outline/${id}:`, errorData);
      return NextResponse.json({ message: `Failed to generate outline for topic ${id}`, error: errorData.detail || 'Unknown error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`Network or other error in /api/generate-outline/${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Error generating outline for topic ${id}`, error: errorMessage }, { status: 500 });
  }
} 