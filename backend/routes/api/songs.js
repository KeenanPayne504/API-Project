const express = require('express');
const { Song, Album } = require('../../db/models');
const song = require('../../db/models/song');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');
const album = require('../../db/models/album');

const router = express.Router();

// Get all songs
router.get('/', async(req, res) => {
    const song = await Song.findAll()
    res.status(200)
    return res.json(song)
  })

// get songs of current user
  router.get("/current", requireAuth, async (req, res) => {
    const currentSong = await Song.findAll({
      where: {userId: req.user.id,},
    });

    res.status(200);
    return res.json({
      "Songs": currentSong,
    });
  });

  //get songs by id
  router.get("/:songId", requireAuth, async (req, res) => {


    const { songId } = req.params;
    console.log(req.params)
    const getArtist = await Song.findByPk(songId, {
      include: [
        {model: User, attributes: ["id", "username"]},
        {model: Album, attributes: ["id", "title"]}
        // add previewimage later
      ],
        where: {
          userId: req.user.id,
        },
      });
      console.log(getArtist)

      // if (!getArtist) {
      //   return res.json({
      //     message: "Artist couldn't be found",
      //     statusCode: 404,
      //   });
      // }

    res.status(200);
    return res.json(getArtist);
  });


  //Create new song
  router.post("/", requireAuth, async (req, res) => {
    const { title, description, url, imageUrl, albumId} =
      req.body;
    const userId = req.user.dataValues.id;

    const createSong = await Song.create({
      userId,
      title,
      description,
      url,
      imageUrl,
      albumId: albumId
    });
    // double check albumId check

    if (!createSong) {
      res.status(400);
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          title: "Song title is required",
          url: "Audio is required"
        },
      });
    }
    res.status(201);
    return res.json({
      userId,
      title,
      description,
      url,
      imageUrl,
      albumId: albumId
    });
  });

  //edit an Spot
  router.put("/:songId", async (req, res) => {
    const { songId } = req.params;
    const { title, description, url, imageUrl, albumId } =
      req.body;
    const editSong = await Song.findByPk(songId);

    if (editSong) {
      editSong.set({
      title,
      description,
      url,
      imageUrl,
      albumId: albumId
      });

      await editSong.save();

      res.json(editSong);
    } else if (!songId) {
      res.status(400);
      return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "title": "Song title is required",
          "url": "Audio is required"
        }
      });
    }
    if (!editSong) {
      res.status(404);
      return res.json({
        message: "Song couldn't be found",
        statusCode: 404,
      });
    }
  });





  module.exports = router;
