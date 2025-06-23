import { NextResponse } from 'next/server';

// This is a placeholder for the actual data fetching from your backend.
// It mocks the response that would come from:
// GET /generated_newsletters/by_outline/{outline_id}

// In a real scenario, you would fetch from your backend API:
// const apiResponse = await fetch(`YOUR_BACKEND_URL/generated_newsletters/by_outline/${params.outline_id}`);
// const data = await apiResponse.json();

export async function GET(
  request: Request,
  { params }: { params: { outline_id: string } }
) {
  const { outline_id } = params;

  // Mock data for now, mirroring the structure of the hardcoded component
  const mockNewsletterData = {
    title: 'Momentum',
    sections: [
      {
        type: 'content',
        title: '',
        body: "Recently, we've observed a significant shift in the investment landscape...",
      },
      {
        type: 'content',
        title: 'Navigating the Ripple Effects: From AI Challenges to Strategic Action',
        body: "These AI roll-ups create significant ripples...",
      },
      // ... more sections based on the HTML structure
    ],
    author: {
      name: 'Tim Rutten',
      title: 'Chief Marketing Officer, Backbase',
      image: '/timProfilePic.png',
    },
    slide: {
      title: 'Slide of the week',
      image: '/Slideoftheweek.png',
    },
  };

  // Here, we're just returning the mock data with a success status.
  // We include the outline_id to show it's being received correctly.
  return NextResponse.json({
    message: `Successfully fetched mock data for outline_id: ${outline_id}`,
    data: mockNewsletterData
  });
} 