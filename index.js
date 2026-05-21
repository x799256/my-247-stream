const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const playlist = [
    { id: "0Y_aBF8CDzQ", duration: 77 }, // 1:17
    { id: "-JCIUhtLrlE", duration: 73 }, // 1:13
    { id: "AmgKXWUFNug", duration: 63 }  // 1:03
];

const totalDuration = playlist.reduce((sum, video) => sum + video.duration, 0);

app.get('/live.m3u8', (req, res) => {
    const currentSeconds = Math.floor(Date.now() / 1000);
    let elapsedInLoop = currentSeconds % totalDuration;

    let activeVideoID = playlist[0].id;

    for (const video of playlist) {
        if (elapsedInLoop < video.duration) {
            activeVideoID = video.id;
            break;
        }
        elapsedInLoop -= video.duration;
    }

    // 🚀 Pleyerin keşləməsinin qarşısını almaq üçün linkə unikal vaxt damğası (?t=...) əlavə edirik
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideoID}.m3u8?t=${currentSeconds}`;

    // Pleyerə keşləməni (yaddaşda saxlamağı) qəti şəkildə qadağan edən başlıqlar (Headers)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.redirect(302, workerStreamUrl);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
