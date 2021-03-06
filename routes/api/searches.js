const express = require("express");
const router = express.Router();
const Track = require("../../models/Track");
const User = require("../../models/User");
const validText = require("../../validation/valid-text");

// search
router.get('/?', (req,res) => {
  const query = req.query.search;

  if (!validText(query)) {
    return res.status(400).json("Invalid Query");
  }

  const usersQuery = User.find({ handle: { $regex: query, $options: "i" } });
  const tracksQuery = Track.find({ title: { $regex: query, $options: "i" } });

  Promise.all([usersQuery, tracksQuery])
    .then(queryArr => {
      const queryResult = {
        users: queryArr[0],
        tracks: queryArr[1]
      }

      return res.json(queryResult);
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;