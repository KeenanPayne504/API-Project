const express = require('express');
const { Song, Album, Comment } = require('../../db/models');
const song = require('../../db/models/song');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');
const album = require('../../db/models/album');

const router = express.Router();

// Get all songs
router.get('/', async(req, res) => {
  let { page, size } = req.query;
   page = parseInt(page)
   size = parseInt(size)


   const pagination = {};

   if (!page) page = 1;
   if (!size) size = 20;

   if (page >= 1 && size >= 1) {
     pagination.limit = size;
     pagination.offset = size * (page - 1);
   }

  const allSongs = await Song.findAll({
  ...pagination
  })
  res.status(200);
  res.json({
    "Songs":allSongs,
    "page": page,
    "size": size
   });
  });

// get songs of current user
  router.get("/current", requireAuth, async (req, res) => {
    const currentSong = await Song.findAll({
      where: {userId: req.user.id,},
    });

    res.status(200);
    return res.json({
      "Songs": currentSong
    });
  });

  //get  details of a song by id
  router.get("/:songId", requireAuth, async (req, res) => {


    const { songId } = req.params;
    console.log(req.params)
    const getSong = await Song.findByPk(songId, {
      include: [
        {model: User, as: "Artist", attributes: ["id", "username"]},
        {model: Album, attributes: ["id", "title"]}
        // add previewimage later
      ],
        where: {
          userId: req.user.id,
        },
      });

      if (!getSong) {
        return res.json({
          message: "Song couldn't be found",
          statusCode: 404,
        });
      }

    res.status(200);
    return res.json(getSong);
  });


  //get all comments for song by Id
  router.get("/:songId/comments", requireAuth, async (req, res) => {


    console.log(req.params)
    const getComment = await Comment.findAll({
      include: [
        {model: User, attributes: ["id", "username"]}
        // add previewimage later
      ],
        where: {
          userId: req.user.id,
        },
      });



    res.status(200);
    return res.json({
      "Comments": getComment
    });
  });


  //create a comment for a song by Id
  //* still need to return Id
  router.post("/:songId/comments", requireAuth, async (req, res) => {
    const { body} = req.body;
    const userId = req.user.dataValues.id;
    const songId = req.params.songId;
    const createdAt = req.user.dataValues.createdAt;
    const updatedAt = req.user.dataValues.updatedAt;

    const createComment = await Comment.create({

      songId,
      userId,
      body,
      createdAt,
      updatedAt
    });


    if (!createComment) {
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
    return res.json(
      createComment);
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
      createSong
    });
  });

  //edit a Song
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


// delete a song
router.delete("/:songId", requireAuth, async (req, res) => {
  const { songId } = req.params;
  const findSong = await Song.findByPk(songId);

  if (!findSong) {
    res.status(404);
    return res.json({
      message: "Song couldn't be found",
      statusCode: 404,
    });
  }

  await findSong.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});


  module.exports = router;
