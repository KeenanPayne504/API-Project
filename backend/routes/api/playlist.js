const express = require('express');
const { Playlist, PlaylistSong, Song} = require('../../db/models');
const playlist = require('../../db/models/playlist');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');




const router = express.Router();

// get playlists of current user
router.get("/current", requireAuth, async (req, res) => {
    const currentPlaylist = await Playlist.findAll({
      where: {userId: req.user.id,},
    });

    res.status(200);
    return res.json({
      "Playlists": currentPlaylist
    });
  });


//Create new playlist
router.post("/", requireAuth, async (req, res) => {
    const { name, imageUrl} = req.body;
    const userId = req.user.dataValues.id;
    const createdAt = req.user.dataValues.createdAt;
    const updatedAt = req.user.dataValues.updatedAt;

    const createPlaylist = await Playlist.create({
        userId,
        name,
        imageUrl,
        createdAt,
        updatedAt
    });
    // double check albumId check

    if (!createPlaylist) {
      res.status(400);
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          name: "Playlist name is required"
        },
      });
    }
    res.status(201);
    return res.json({
        userId,
        name,
        imageUrl,
        createdAt,
        updatedAt
    });
  });



//Add song to playlist
router.post('/:playlistId/songs', requireAuth, async (req, res) => {
  const {playlistId} = req.params;
  const {songId} = req.body;

  if (!await Playlist.findByPk(playlistId)) {
    res.status(404)
   return res.json({
     message: "Playlist couldn't be found",
     statusCode: 404
   });
}

 if (!await Song.findByPk(songId)) {
    res.status(404)
   return res.json({
     message: "Song couldn't be found",
     statusCode: 404
   });
}

  await PlaylistSong.create({songId, playlistId});

  const findPlaylist = await PlaylistSong.findOne({
      where: {
          songId: songId,
          playlistId: playlistId
      },
      attributes: ['id', 'songId', 'playlistId']
  });
  res.json(findPlaylist);
});



  //get details of playlist by id
  router.get("/:playlistId",  async (req, res) => {


    const { playlistId} = req.params;
    const getPlaylist = await Playlist.findByPk(playlistId, {
      include: {
        model: Song,
        through: {attributes: []}
      }
    });
    console.log(req.params)

      if (!getPlaylist) {
        return res.json({
          message: "Playlist couldn't be found",
          statusCode: 404,
        });
      }

    res.status(200);
    return res.json(getPlaylist);
  });



  //edit a Playlist
  router.put("/:playlistId", async (req, res) => {
    const { playlistId } = req.params;
    const { name, imageUrl } =
      req.body;
    const editPlaylist = await Playlist.findByPk(playlistId);

    if (editPlaylist) {
      editPlaylist.set({
      name,
      imageUrl
      });

      await editPlaylist.save();

      res.json(editPlaylist);
    } else if (!playlistId) {
      res.status(400);
      return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "name": "Playlist name is required"
        }
      });
    }
    if (!editPlaylist) {
      res.status(404);
      return res.json({
        message: "Playlist couldn't be found",
        statusCode: 404,
      });
    }
  });

  // delete a playlist

router.delete("/:playlistId", requireAuth, async (req, res) => {
  const { playlistId } = req.params;
  const findPlaylist = await Playlist.findByPk(playlistId);

  if (!findPlaylist) {
    res.status(404);
    return res.json({
      message: "Playlist couldn't be found",
      statusCode: 404,
    });
  }

  await findPlaylist.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});
  //






module.exports = router;
