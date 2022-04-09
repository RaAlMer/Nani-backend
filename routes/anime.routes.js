const express = require("express");
const axios = require("axios");

const router = express.Router();

async function getTrendingAnime() {
  const url = "https://kitsu.io/api/edge/trending/anime";
  const response = await axios.get(url);
  return response.data.data;
}

async function getAnimeData(id) {
  const url = `https://kitsu.io/api/edge/anime/${id}`;
  const response = await axios.get(url)
  return response.data.data
}

router.get("/home", async (req, res) => {
  try {
    const trend = await getTrendingAnime();
    res.status(200).json(trend);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log(req.params)
    const item = await getAnimeData(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
