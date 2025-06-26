import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8080';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ newsletterId: string }> }
) {
  const { newsletterId } = await params;
  if (!newsletterId) {
    return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
  }

  try {
    const fastApiResponse = await fetch(
      `${FASTAPI_BASE_URL}/generated_newsletters/${newsletterId}/regenerate`,
      {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
          // No Content-Type needed for this specific POST as it doesn't send a body
        },
        // No body is sent for this regeneration trigger
      }
    );

    if (!fastApiResponse.ok) {
      const errorBody = await fastApiResponse.text();
      console.error(`FastAPI error (${fastApiResponse.status}) regenerating newsletter:`, errorBody);
      return NextResponse.json(
        { error: `Failed to regenerate newsletter: ${errorBody || fastApiResponse.statusText}` },
        { status: fastApiResponse.status }
      );
    }

    const data = await fastApiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/newsletters/[newsletterId]/regenerate:', error);
    let message = 'Internal Server Error';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ error: 'Failed to process request to regenerate newsletter', details: message }, { status: 500 });
  }
} 