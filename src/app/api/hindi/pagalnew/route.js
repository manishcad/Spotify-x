import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const page = Number(pageParam) > 0 ? pageParam : '1'; // Validate page

  try {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const response = await axios.get(`https://pagalnew.com/category/bollywood-mp3-songs/${page}`, {
      timeout: 10000, // 10 seconds timeout
     
    
      headers: {
        'User-Agent': userAgent,
        'Referer': 'https://www.google.com/',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="114", "Google Chrome";v="114", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Windows',
        'accept-encoding': 'gzip, deflate, br',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'connection': 'keep-alive',
        'upgrade-insecure-requests': '1'
      }
    });

    const $ = cheerio.load(response.data);

    const albumElements = $(".main_page_category_music").toArray();
    const albumPromises = albumElements.map(async (element) => {
      const albumLink = $(element).find("a").attr("href") || '';
      const albumImage = $(element).find(".main_page_category_music_img img").attr("src") || '';
      const albumName = $(element).find(".main_page_category_music_txt div").first().text().trim();
      const singerName = $(element).find(".main_page_category_music_txt div").last().text().trim();
      
      let albumSongs = [];
      let albumCover = '';

      if (albumLink) {
        try {
          const albumResponse = await axios.get(albumLink, { timeout: 10000 });
          const albumPage = cheerio.load(albumResponse.data);
          albumCover = albumPage("left img").attr("data-src") || '';

          const songElements = albumPage(".main_page_category_music a").toArray();
          albumSongs = await Promise.all(songElements.map(async (el) => {
            const songLink = albumPage(el).attr("href") || '';
            const songName = albumPage(el).text().trim().replace(/\t/g, '');
            let downloadLink = null;

            if (songLink) {
              try {
                const songResponse = await axios.get(songLink, { timeout: 10000 });
                const songPage = cheerio.load(songResponse.data);
                downloadLink = songPage(".downloaddiv a").first().attr("href") || null;
              } catch (error) {
                console.error(`Error fetching song: ${songLink}`, error.message);
              }
            }

            return { songLink, downloadLink, songName, albumCover };
          }));
        } catch (error) {
          console.error(`Error fetching album: ${albumLink}`, error.message);
        }
      }

      return { albumLink, albumName, singerName, albumImage, albumSongs };
    });

    const allDetails = await Promise.all(albumPromises);

    return Response.json({ allDetails });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
