import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

  try {
    const urls = await prisma.sitemapUrl.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(urls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sitemap urls' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { projectId, urls } = await request.json();
    
    if (!projectId || !urls) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Replace all urls for the project
    await prisma.sitemapUrl.deleteMany({
      where: { projectId }
    });
    
    const created = await prisma.sitemapUrl.createMany({
      data: urls.map((u: any) => ({
        url: u.url,
        title: u.title,
        status: u.status,
        projectId: projectId
      }))
    });

    return NextResponse.json({ count: created.count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save sitemap' }, { status: 500 });
  }
}
