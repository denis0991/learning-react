import { NextResponse } from 'next/server';
import { generateCSV } from '../../../app/actions/csvActions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { animalIds } = body;

    if (!animalIds || !Array.isArray(animalIds) || animalIds.length === 0) {
      return NextResponse.json(
        { error: 'No animal IDs provided' },
        { status: 400 }
      );
    }

    const result = await generateCSV(animalIds);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return new NextResponse(result.data, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}