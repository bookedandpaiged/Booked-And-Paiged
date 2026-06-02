import { NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/db';

export async function GET() {
  try {
    const data = await loadData('paige');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load data:', error);
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await saveData('paige', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
