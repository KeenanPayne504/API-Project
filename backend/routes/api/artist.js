const express = require('express');
const { Song } = require('../../db/models');
const song = require('../../db/models/song');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');

const router = express.Router();

// Get songs from userId through artist
router.get("/:userId/songs", requireAuth, async (req, res) => {


    const { userId } = req.params;
    console.log(req.params)
    const getArtist = await Song.findByPk(userId, {
        where: {
          userId: req.user.id,
        },
      });
      console.log(getArtist)

      if (!getArtist) {
        return res.json({
          message: "Artist couldn't be found",
          statusCode: 404,
        });
      }

    res.status(200);
    return res.json(getArtist);
  });






  module.exports = router;
