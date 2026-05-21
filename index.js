const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ 1. Videolarının ID-lərini və dəqiq SANİYƏ müddətlərini bura yazırsan
const playlist = [
    { id: "0Y_aBF8CDzQ", duration: 77 }, // 1:17 = 77 saniyə
    { id: "-JCIUhtLrlE", duration: 73 }, // 1:13 = 73 saniyə
    { id: "AmgKXWUFNug", duration: 63 }  // 1:03 = 63 saniyə
];

// Bütün videoların ümumi müddətini saniyə ilə hesablayırıq (Cəmi: 213 saniyə)
const totalDuration = playlist.reduce((sum, video) => sum + video.duration, 0);

app.get('/live.m3u8', (req, res) => {
    // Cari vaxtı saniyəyə çeviririk (1970-dən bəri keçən saniyələr)
    const currentSeconds = Math.floor(Date.now() / 1000);
    
    // Dünyanın ümumi zamanını bizim pleylistin ümumi müddətinə bölüb qalığı tapırıq
    // Bu, döngünün buludda heç vaxt dayanmadan, saniyəbəsaniyə fırlanmasını təmin edir
    let elapsedInLoop = currentSeconds % totalDuration;

    let activeVideoID = playlist[0].id; // Varsayılan olaraq ilk video

    // Şpion kimi saniyələri izləyib, hal-hazırda hansı videonun oynadığını tapırıq
    for (const video of playlist) {
        if (elapsedInLoop < video.duration) {
            activeVideoID = video.id;
            break;
        }
        elapsedInLoop -= video.duration;
    }

    // Sənin işlək Cloudflare Worker linkin
    const workerStreamUrl = `https://movies.yt-hls.workers.dev/${activeVideoID}.m3u8`;

    res.redirect(302, workerStreamUrl);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
