import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    // Step 1: Define multiple user agents
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    ];

    // Step 2: Randomly select a user agent
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Step 3: Fetch with custom random user agent
    const response = await fetch('https://www9.hiphopkit.com/music/chart/hot-100/', {
        headers: {
            'User-Agent': userAgent,
            'Referer': 'https://www.google.com/',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];

    $('li.chart-li').each((index, element) => {
      const link = $(element).find('a').attr('href') || "";
      const badge = $(element).find('.badge-rate').text().trim() || "";
      const img = $(element).find('img').attr('data-src') || "";
      const title = $(element).find('h2.name-title').text().trim() || "";
      const artist = $(element).find('.artistname').text().trim() || "";
      const downloads = $(element).find('.smallspan').text().trim() || "";

      results.push({ link, badge, img, title, artist, downloads });
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}
