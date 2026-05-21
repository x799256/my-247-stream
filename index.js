const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Sənin YouTube videolarının ID-ləri
const videoIDs = [
    "0Y_aBF8CDzQ",
    "-JCIUhtLrlE",
    "AmgKXWUFNug"
];

// Pleyerə ötürüləcək vahid canlı yayım linki
app.get('/live.ts', (req, res) => {
    // Cari zamana görə hansı videonun oynamalı olduğunu tapırıq
    const currentMinutes = Math.floor(Date.now() / 60000);
    const videoIndex = Math.floor(currentMinutes / 1) % videoIDs.length; // Hər 2 dəqiqədən bir videonu dəyişir
    const activeVideoID = videoIDs[videoIndex];

    // Sənin işlək Cloudflare Worker linkin
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideoID}.m3u8`;

    console.log(`Yayımlanan video: ${activeVideoID}`);

    // Pleyerə bunun rəsmi bir Canlı TV yayımı (MPEG-TS) olduğunu bildiririk
    res.contentType('video/mp2t');

    // FFmpeg işə düşür: Videonun formatını pleyer üçün standart "Canlı TV" formatına salır
    ffmpeg(workerStreamUrl)
        .inputOptions([
            '-re' // Videonu öz real vaxt sürətində oxu (canlı yayım effekti)
        ])
        .outputOptions([
            '-c:v copy', // Videonu yenidən kodlama (Render serveri yorulmasın və sürətli olsun)
            '-c:a copy', // Səsi yenidən kodlama
            '-f mpegts'  // Vahid Canlı TV formatı
        ])
        .on('error', (err) => {
            console.log('FFmpeg Xətası: ' + err.message);
        })
        .pipe(res, { end: true }); // Yayımı birbaşa pleyerə ötür (pipe)
});

app.listen(PORT, () => console.log(`Server 24/7 rejimində ${PORT} portunda aktivdir`));
