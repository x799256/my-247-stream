const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Bura sadəcə YouTube videolarının 11 rəqəmli ID-lərini yazırıq (v= hissəsindən sonrakını)
const videoIDs = [
    "0Y_aBF8CDzQ",
    "-JCIUhtLrlE",
    "AmgKXWUFNug"
];

app.get('/playlist.m3u', (req, res) => {
    // Videoları zamana görə sırayla fırladan riyazi döngü
    const currentMinutes = Math.floor(Date.now() / 60000);
    const videoIndex = Math.floor(currentMinutes / 15) % videoIDs.length; 
    const activeVideoID = videoIDs[videoIndex];

    // SƏNİN İŞLƏK CLOUDFLARE WORKER LİNKİN
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideoID}.m3u8`;

    // Pleyer üçün təmiz M3U formatı
    let m3uContent = `#EXTM3U\n`;
    m3uContent += `#EXTINF:-1, Mənim 24/7 Canlı Kanalım\n`;
    m3uContent += `${workerStreamUrl}\n`;

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.send(m3uContent);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
