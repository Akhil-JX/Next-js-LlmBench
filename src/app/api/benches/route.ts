import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BENCHES_FILE = path.join(DATA_DIR, 'benches.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readBenches() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BENCHES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBenches(benches: any[]) {
  await ensureDataDir();
  await fs.writeFile(BENCHES_FILE, JSON.stringify(benches, null, 2));
}

export async function GET() {
  try {
    const benches = await readBenches();
    return NextResponse.json(benches);
  } catch (error) {
    console.error('Error reading benches:', error);
    return NextResponse.json(
      { error: 'Failed to read benches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const benchData = await request.json();
    
    const benches = await readBenches();
    benches.push(benchData);
    
    await writeBenches(benches);
    
    return NextResponse.json(benchData, { status: 201 });
  } catch (error) {
    console.error('Error creating bench:', error);
    return NextResponse.json(
      { error: 'Failed to create bench' },
      { status: 500 }
    );
  }
}