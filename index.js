const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const playlist = [
    { id: "0Y_aBF8CDzQ", duration: 77 },
    { id: "-JCIUhtLrlE", duration: 73 },
    { id: "AmgKXWUFNug", duration: 63 }
];

app.get('/live.m3u8', (req, res) => {
    // Pleyerə deyirik ki, bu "Canlı Yayım"dır, "Statik Fayl" deyil
    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.setHeader('Cache-Control', 'no-cache');

    // M3U8 Master Playlist formatı (Pleyer bu strukturu görəndə onu canlı kanal kimi qəbul edir)
    let m3u8Content = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:100\n#EXT-X-MEDIA-SEQUENCE:0\n`;
    
    playlist.forEach((video, index) => {
        m3u8Content += `#EXTINF:${video.duration},\n`;
        // Hər videonun sonuna unikal ID əlavə edirik ki, pleyer bunu fərqli hissələr kimi görsün
        m3u8Content += `https://movies.yt-hls.workers.dev/${video.id}.m3u8\n`;
    });

    res.send(m3u8Content);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
