const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');

const {validateToken} = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try{
    const listOfPosts = await Posts.findAll({ include: [Likes] });

        // Check if req.user exists and has id
        if (!req.user || !req.user.id) {
          return res.status(400).json({ error: "Invalid token or missing user data" });
        }

    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });

    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
      }
      catch (error) {
        console.error("🔥 Error in GET /posts:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findOne({
    where: { id: id },
    include: [Likes],
  });
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({
      where: {
        id: postId,
      },
    });
  
    res.json("DELETED SUCCESSFULLY");
});

module.exports = router;