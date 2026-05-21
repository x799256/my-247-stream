const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ BURA İSTƏDİYİN QƏDƏR YOUTUBE LİNKİ ƏLAVƏ EDƏ BİLƏRSƏN
const videoList = [
    "https://www.youtube.com/watch?v=PWFKYZ9cbis",
    "https://www.youtube.com/watch?v=ChS5CcxbXlc",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
];

app.get('/playlist.m3u', (req, res) => {
    // Videoları zamana görə sırayla fırladan riyazi döngü (Kompütersiz işləyir)
    const currentMinutes = Math.floor(Date.now() / 60000);
    const videoIndex = Math.floor(currentMinutes / 15) % videoList.length; 
    const activeVideo = videoList[videoIndex];

    // Pleyerin başa düşəcəyi yönləndirmə şablonu
    let m3uContent = `#EXTM3U\n`;
    m3uContent += `#EXTINF:-1, Mənim 24/7 Canlı Kanalım\n`;
    m3uContent += `${activeVideo}\n`;

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.send(m3uContent);
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir`));
