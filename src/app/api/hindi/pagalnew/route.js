import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const response = await axios.get(`https://pagalnew.com/category/bollywood-mp3-songs/${page}`,{
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
      }
    });
    const $ = cheerio.load(response.data);
    const allDetails = [];

    const albumPromises = $(".main_page_category_music").map(async (index, element) => {
      const albumLink = $(element).find("a").attr("href");
      const albumImage = $(element).find(".main_page_category_music_img img").attr("src");
      const albumName = $(element).find(".main_page_category_music_txt div").first().text().trim();
      const singerName = $(element).find(".main_page_category_music_txt div").last().text().trim();

      let albumSongs = [];
      if (albumLink) {
        try {
          const albumResponse = await axios.get(albumLink);
          const albumPage = cheerio.load(albumResponse.data);
          const albumCover = albumPage("left img").attr("data-src");

          albumSongs = await Promise.all(albumPage(".main_page_category_music a").map(async (i, el) => {
            const songLink = albumPage(el).attr("href");
            const songName = albumPage(el).text().trim().replace(/\t/g, '');
            let downloadLink = null;

            if (songLink) {
              try {
                const songResponse = await axios.get(songLink);
                const songPage = cheerio.load(songResponse.data);
                downloadLink = songPage(".downloaddiv a").first().attr("href");
              } catch (error) {
                console.error(`Error fetching song ${songLink}:`, error);
              }
            }

            return { songLink, downloadLink, songName, albumCover };
          }).get());
        } catch (error) {
          console.error(`Error fetching ${albumLink}:`, error);
        }
      }

      return { albumLink, albumName, singerName, albumImage, albumSongs };
    }).get();

    const allData = await Promise.all(albumPromises);

    return Response.json({ allDetails: allData });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ Error: 'Error fetching data' }), {
      status: 500
    });
  }
}
