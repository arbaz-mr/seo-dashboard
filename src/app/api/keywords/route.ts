import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  try {
    const keywords = await prisma.keyword.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support bulk create or update by deleting existing for project and inserting new
    if (body.keywords && body.projectId) {
      await prisma.keyword.deleteMany({
        where: { projectId: body.projectId }
      });
      
      const created = await prisma.keyword.createMany({
        data: body.keywords.map((kw: any) => ({
          keyword: kw.keyword,
          url: kw.url,
          projectId: body.projectId
        }))
      });
      return NextResponse.json({ count: created.count });
    }

    // Support single create
    const keyword = await prisma.keyword.create({
      data: {
        keyword: body.keyword,
        url: body.url,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(keyword);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create keyword' }, { status: 500 });
  }
}
