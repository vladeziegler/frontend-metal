import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8080';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Ensure request is "used" asynchronously before accessing params to satisfy Next.js
  try {
    await request.text(); // Or request.json() if a body was expected and used.
  } catch {
    // Ignore error from reading body if not actually needed or empty
  }

  const { id } = await params;
  if (!id || isNaN(parseInt(id))) { // Add validation for id
    return NextResponse.json({ message: 'Valid Topic ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/meta_suggestions/${id}/choose`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error(`Error from FastAPI /meta_suggestions/${id}/choose:`, errorData);
      return NextResponse.json({ message: `Failed to choose topic ${id}`, error: errorData.detail || 'Unknown error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`Network or other error in /api/topics/${id}/choose:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Error choosing topic ${id}`, error: errorMessage }, { status: 500 });
  }
} 