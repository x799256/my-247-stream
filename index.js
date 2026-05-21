const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ YouTube videolarının ID-ləri və saniyə müddətləri
const playlist = [
    { id: "0Y_aBF8CDzQ", duration: 77 }, // 1:17
    { id: "-JCIUhtLrlE", duration: 73 }, // 1:13
    { id: "AmgKXWUFNug", duration: 63 }  // 1:03
];

const totalDuration = playlist.reduce((sum, video) => sum + video.duration, 0);

app.get('/live.ts', (req, res) => {
    const currentSeconds = Math.floor(Date.now() / 1000);
    let elapsedInLoop = currentSeconds % totalDuration;

    let activeVideo = playlist[0];

    for (const video of playlist) {
        if (elapsedInLoop < video.duration) {
            activeVideo = video;
            break;
        }
        elapsedInLoop -= video.duration;
    }

    // Pleyerin "bu eyni videodur" deyib keşləməməsi üçün linkin sonuna dynamic bir saniyə ID-si əlavə edirik
    // Bu, pleyeri hər dəfə yeni bir canlı TV yayımı açıldığına inandıracaq
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideo.id}.m3u8?stream_type=live&timestamp=${currentSeconds}`;

    // Təhlükəsizlik və keş əleyhinə bəyanatlar
    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Pleyeri birbaşa worker linkinə 302 ilə yönləndiririk
    res.redirect(302, workerStreamUrl);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
