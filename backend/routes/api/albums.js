const express = require('express');
const { Album, Song } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');


const router = express.Router();

// Get all albums
router.get('/', async(req, res) => {
    const album = await Album.findAll()
    res.status(200)
    return res.json(album)
  })


// get Albums of current user
router.get("/current", requireAuth, async (req, res) => {
  const currentAlbum = await Album.findAll({
    where: {userId: req.user.id,},
  });

  res.status(200);
  return res.json({
    "Albums": currentAlbum
  });
});

//get details of album by id

//do album validation error responses
router.get("/:albumId", requireAuth, async (req, res) => {


  const { albumId } = req.params;
  const getAlbum = await Album.findByPk(albumId, {
      include: {
          model: Song
        },
      where: {
        userId: req.user.id,
      },
    });


  res.status(200);
  return res.json(getAlbum);
});






//Create new album
router.post("/", requireAuth, async (req, res) => {
  const { title, description,imageUrl} = req.body;
  const userId = req.user.dataValues.id;
  const createdAt = req.user.dataValues.createdAt;
  const updatedAt = req.user.dataValues.updatedAt;

  const createAlbum = await Album.create({
      userId,
      title,
      description,
      createdAt,
      updatedAt,
      imageUrl

  });
  // double check albumId check

  if (!createAlbum) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        name: "Album title is required"
      },
    });
  }
  res.status(201);
  return res.json({
    userId,
    title,
    description,
    createdAt,
    updatedAt,
    imageUrl
  });
});







//edit a Album
router.put("/:albumId", async (req, res) => {
  const { albumId } = req.params;
  const { title, description, imageUrl } = req.body;
  const userId = req.user.dataValues.id;
  const createdAt = req.user.dataValues.createdAt;
  const updatedAt = req.user.dataValues.updatedAt;
  const editAlbum = await Album.findByPk(albumId);

  if (editAlbum) {
    editAlbum.set({
      userId,
      title,
      description,
      createdAt,
      updatedAt,
      imageUrl

    });

    await editAlbum.save();

    res.json(editAlbum);
  } else if (!albumId) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "name": "Playlist name is required"
      }
    });
  }
  if (!editAlbum) {
    res.status(404);
    return res.json({
      message: "Album couldn't be found",
      statusCode: 404,
    });
  }
});


router.delete("/:albumId", requireAuth, async (req, res) => {
  const { albumId } = req.params;
  const findAlbum = await Album.findByPk(albumId);

  if (!findAlbum) {
    res.status(404);
    return res.json({
      message: "Album couldn't be found",
      statusCode: 404,
    });
  }

  await findAlbum.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});


module.exports = router;
