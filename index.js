const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const igdl = require('instagram-downloader');


app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  const platform = req.query.platform;

  if (!videoUrl || !platform) {
    return res
      .status(400)
      .json({ error: "video link and platform is required" });
  }
  switch (platform) {
    case "instagram":
      igdl.downloadByUrl(videoUrl).then(downloadPath=>{
        console.log('reel downlaoded successfully:', downloadPath)
      }).catch(error => {
        console.error("Error:",error)
      })
      break;
    case "youtube":
      ytdl(videoUrl).pipe(res); // stream video as response
      break;
    default:
      return res.status(400).json("invalid platform selected");
  }
});

app.get("/getinfo", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    res.status(400).json({ error: "you have to have a video url" });
  }

  try {
    const info = await ytdl.getInfo(videoUrl)
    return res.json(info);
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error: "Info cannot be obtained" });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
