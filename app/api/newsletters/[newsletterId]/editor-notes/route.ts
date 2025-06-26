import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ newsletterId: string }> }
) {
  const { newsletterId } = await params;
  if (!newsletterId) {
    return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { editor_notes } = body;

    if (typeof editor_notes === 'undefined') {
      return NextResponse.json({ error: 'editor_notes are required in the body' }, { status: 400 });
    }

    const fastApiResponse = await fetch(
      `${FASTAPI_BASE_URL}/generated_newsletters/${newsletterId}/editor_notes`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ editor_notes }), // FastAPI expects { "editor_notes": "..." }
      }
    );

    if (!fastApiResponse.ok) {
      const errorBody = await fastApiResponse.text();
      console.error(`FastAPI error (${fastApiResponse.status}) saving notes:`, errorBody);
      return NextResponse.json(
        { error: `Failed to save editor notes: ${errorBody || fastApiResponse.statusText}` },
        { status: fastApiResponse.status }
      );
    }

    const data = await fastApiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/newsletters/[newsletterId]/editor-notes:', error);
    let message = 'Internal Server Error';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ error: 'Failed to process request to save editor notes', details: message }, { status: 500 });
  }
} 