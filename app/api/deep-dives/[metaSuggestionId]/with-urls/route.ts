import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = 'http://localhost:8080';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metaSuggestionId: string }> }
) {
  const { metaSuggestionId } = await params;

  if (!metaSuggestionId || isNaN(parseInt(metaSuggestionId, 10))) {
    return NextResponse.json({ error: 'Valid metaSuggestionId is required' }, { status: 400 });
  }

  try {
    const fastApiResponse = await fetch(
      `${FASTAPI_BASE_URL}/deep-dives/${metaSuggestionId}/with-urls`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
          // Add any other necessary headers, like Authorization if your FastAPI is secured
        },
      }
    );

    if (!fastApiResponse.ok) {
      const errorBody = await fastApiResponse.text();
      console.error(`FastAPI error (${fastApiResponse.status}) fetching deep dives with URLs for metaSuggestionId ${metaSuggestionId}:`, errorBody);
      return NextResponse.json(
        { error: `Failed to fetch deep dives with URLs: ${errorBody || fastApiResponse.statusText}` },
        { status: fastApiResponse.status }
      );
    }

    const data = await fastApiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(`Error in GET /api/deep-dives/[metaSuggestionId]/with-urls for ID ${metaSuggestionId}:`, error);
    let message = 'Internal Server Error';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ error: 'Failed to process request to fetch deep dives with URLs', details: message }, { status: 500 });
  }
} 