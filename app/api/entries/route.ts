import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      const entry = await prisma.entry.findUnique({
        where: { date },
      });
      return NextResponse.json(entry || null);
    }

    const entries = await prisma.entry.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(entries);
  } catch (error: any) {
    console.error('Error in GET /api/entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, title, content, id } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const savedEntry = await prisma.entry.upsert({
      where: { date },
      update: {
        title: title !== undefined ? title.trim() : undefined,
        content: content !== undefined ? content : '',
      },
      create: {
        id: id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date,
        title: title ? title.trim() : '',
        content: content || '',
      },
    });

    return NextResponse.json(savedEntry);
  } catch (error: any) {
    console.error('Error in POST /api/entries:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    await prisma.entry.deleteMany({
      where: { date },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/entries:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
