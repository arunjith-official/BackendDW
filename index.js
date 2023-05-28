const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const { promisify } = require("util");

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
      try {
        //fetching content of the post (html)
        const response = await axios.get(videoUrl);
        const html = response.data;

        //parsing html content using cheerio
        const $ = cheerio.load(html);

        //extract video URL from the html
        const videoSrc = $(`meta[property="og:video"]`).attr("content");
        if (!videoSrc) {
          return res
            .status(400)
            .json({ error: "video url is not present in this post" });
        }
        // Downloading the video
        const videoResponse = await axios.get(videoSrc, {
          responseType: "stream",
        });
        videoResponse.data.pipe(res); //stream the videoResponse
      } catch (error) {
        console.log("Error:", error);
        res
          .status(500)
          .json({ error: "There was an error when downloading the video" });
      }
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
    const getInfoPromise = promisify(ytdl.getInfo);
    const info = await getInfoPromise(videoUrl);
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
