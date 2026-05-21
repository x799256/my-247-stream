const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ YouTube videolarının 11 rəqəmli ID-ləri
const videoIDs = [
    "0Y_aBF8CDzQ",
    "-JCIUhtLrlE",
    "AmgKXWUFNug"
];

// ARTIQ LİNKİMİZ BİRBAŞA .m3u8 KİMİ DAVRANACAQ
app.get('/live.m3u8', (req, res) => {
    // Videoları zamana görə sırayla fırladan riyazi döngü
    const currentMinutes = Math.floor(Date.now() / 60000);
    const videoIndex = Math.floor(currentMinutes / 15) % videoIDs.length; 
    const activeVideoID = videoIDs[videoIndex];

    // Sənin işlək Cloudflare Worker linkin
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideoID}.m3u8`;

    // 🚀 BURA ÇOX KRİTİKDİR: Pleyeri birbaşa worker linkinə yönləndiririk (Redirect)
    res.redirect(302, workerStreamUrl);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
