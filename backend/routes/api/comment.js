const express = require('express');
const { Song, Comment} = require('../../db/models');
const comment = require('../../db/models/comment');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');




const router = express.Router();



//edit a comment for a song by Id

//look over again, for stray bug data
router.put("/:commentId", async (req, res) => {
    const { songId } = req.params;
    const { commentId } = req.params;
    const { body } = req.body;
    const editComment = await Comment.findByPk(commentId);

    if (editComment) {
      editComment.set({
      body
      });

      await editComment.save();
      res.json(editComment);

    } else if (!commentId) {
      res.status(400);
      return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "name": "Comment body text is required"
        }
      });
    }
    if (!editComment) {
      res.status(404);
      return res.json({
        message: "Comment couldn't be found",
        statusCode: 404,
      });
    }
  });




  //delete comment

   // delete a playlist

router.delete("/:commentId", requireAuth, async (req, res) => {
    const { commentId } = req.params;
    const findComment = await Comment.findByPk(commentId);

    if (!findComment) {
      res.status(404);
      return res.json({
        message: "Comment couldn't be found",
        statusCode: 404,
      });
    }

    await findComment.destroy();
    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  });

  module.exports = router;
