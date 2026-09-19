import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const pref = await prisma.preference.findUnique({
      where: { key: 'user_prefs' },
    });

    if (pref && pref.value) {
      return NextResponse.json(JSON.parse(pref.value));
    }

    return NextResponse.json(null);
  } catch (error: any) {
    console.error('Error in GET /api/preferences:', error);
    return NextResponse.json(null);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await prisma.preference.upsert({
      where: { key: 'user_prefs' },
      update: {
        value: JSON.stringify(body),
      },
      create: {
        key: 'user_prefs',
        value: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in POST /api/preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
