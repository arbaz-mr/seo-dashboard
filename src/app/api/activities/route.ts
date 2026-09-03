import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  try {
    const activities = await prisma.activity.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity = await prisma.activity.create({
      data: {
        category: body.category,
        keywordId: body.keywordId,
        targetUrl: body.targetUrl,
        backlink: body.backlink,
        platform: body.platform,
        spamScore: body.spamScore ? parseInt(body.spamScore) : null,
        traffic: body.traffic ? parseInt(body.traffic) : null,
        date: body.date,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(activity);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
