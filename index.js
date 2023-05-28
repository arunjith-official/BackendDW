const express = require("express");
const app = express();
const ytdl = require("ytdl-core");

app.get("/download", (req, res) => {
  const videoUrl = req.query.url; // get from query parameter
  if (!videoUrl) {
    return res.status(400).json({ error: "video link is required" });
  }

  ytdl(videoUrl).pipe(res); // stream video as response
});

const port = 3000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})