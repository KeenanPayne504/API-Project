const express = require('express');
const { Song, Playlist, Album } = require('../../db/models');
const song = require('../../db/models/song');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');

const router = express.Router();

// Get songs from userId through artist
router.get("/:userId/songs", requireAuth, async (req, res) => {


    const { userId } = req.params;
    const artist = await User.findByPk(userId)
    if (!artist) {
      return res.json({
        message: "Artist couldn't be found",
        statusCode: 404,
      });
    }
    const getArtist = await Song.findAll({
        where: {
          userId: userId,
        },
      });


    res.status(200);
    return res.json(getArtist);
  });

  //get playlists by artistId
router.get("/:userId/playlists", requireAuth, async (req, res) => {

  const { userId } = req.params;

  
  if (!await User.findByPk(userId)) {
    return res.json({
      message: "Artist couldn't be found",
      statusCode: 404,
    });
  }

    console.log(req.params)
    const getArtist = await Playlist.findAll({
        where: {
          userId: userId,
        },
      });
      console.log(getArtist)


    res.status(200);
    return res.json(getArtist);
  });


// Get Albums from userId through artist
router.get("/:userId/albums", requireAuth, async (req, res) => {


  const { userId } = req.params;
  console.log(req.params)
  const getAlbum = await Album.findByPk(userId, {
      where: {
        userId: req.user.id,
      },
    });
    console.log(getAlbum)

    if (!getAlbum) {
      return res.json({
        message: "Artist couldn't be found",
        statusCode: 404,
      });
    }

  res.status(200);
  return res.json(getAlbum);
});




//get details of artist by id
//fix response details

router.get("/:userId", requireAuth, async (req, res) => {


  const { userId } = req.params;
  const getArtist = await User.findByPk(userId);

  if (!getArtist) {
    res.status(404);
    return res.json({
      message: "Validation Error",
      errors: {
        body: "Artist couldn't be found"
      },
    });
  }


  res.status(200);
  return res.json(getArtist);
});






  module.exports = router;
