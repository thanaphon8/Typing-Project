import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

const DB_NAME = 'pixeltype';
const COL_NAME = 'scores';

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(COL_NAME);
    const scores = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ date: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json(scores);
  } catch (err) {
    console.error('GET /api/scores error:', err);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(COL_NAME);
    await col.deleteMany({});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/scores error:', err);
    return NextResponse.json({ error: 'Failed to delete scores' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wpm, acc, timeLimit, language, difficulty, keystrokes, correctWordsCount, wrongWordsCount, date } = body;

    if (typeof wpm !== 'number' || typeof date !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const doc = { wpm, acc, timeLimit, language, difficulty, keystrokes, correctWordsCount, wrongWordsCount, date };

    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(COL_NAME);
    await col.insertOne(doc);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('POST /api/scores error:', err);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
