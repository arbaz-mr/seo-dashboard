import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

  try {
    const credentials = await prisma.credential.findMany({
      where: { projectId },
    });
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { projectId, credentials } = await request.json();
    
    if (!projectId || !credentials || !Array.isArray(credentials)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Bulk upsert credentials
    const results = [];
    for (const cred of credentials) {
      const result = await prisma.credential.upsert({
        where: {
          projectId_category_key: {
            projectId,
            category: cred.category,
            key: cred.key,
          },
        },
        update: {
          value: cred.value,
        },
        create: {
          projectId,
          category: cred.category,
          key: cred.key,
          value: cred.value,
        },
      });
      results.push(result);
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 });
  }
}
