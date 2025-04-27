import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url);
    const link = searchParams.get('link');

    if (!link) {
      return NextResponse.json({ error: 'Missing link parameter' }, { status: 400 });
    }

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const response = await fetch(link, {
      headers: {
        'User-Agent': userAgent,
        'Referer': 'https://www.google.com/',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the page' }, { status: 500 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const downloadLink = $('p.song-download a#dlf').attr('href') || null;
    const artistName=$(".id3-info li a").first().text()
    
    if (!downloadLink) {
      return NextResponse.json({ error: 'Download link not found' }, { status: 404 });
    }

    return NextResponse.json({ downloadLink,artistName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
