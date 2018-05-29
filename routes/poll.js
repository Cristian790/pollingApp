const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const mongoose = require('mongoose');
const Vote = require('../models/vote');

var pusher = new Pusher({
  appId: '529608',
  key: 'cad89f96f54a1d7c11fc',
  secret: '5775ccae0c234472074c',
  cluster: 'us2',
  encrypted: true
});

router.get('/', async (req, res) => {
  try {
    const votes = await Vote.find({});
    return res.json({
      message: 'Retrieving data',
      votes: votes
    });
  }
  catch (err) { console.log(err) }
});

router.post('/', async (req, res) => {
  try {
    const newVote = {
      os: req.body.os,
      points: 1
    };

    const voteNew = await Vote.create(newVote);
    const votes = await Vote.find({});
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(voteNew.points),
      os: voteNew.os,
      votes: votes

    });

    return res.json({
      success: true,
      message: 'Thank you',
      vote: voteNew,
      votes: votes
    });
  }
  catch (err) { console.log(err) }
  // Vote.create(newVote)
  //   .then(vote => {
  //     pusher.trigger('os-poll', 'os-vote', {
  //       points: parseInt(vote.points),
  //       os: vote.os
  //     });
  //     const vot = Vote.find({}).then(votes => {
  //       // console.log(votes);
  //       return votes;
  //     });
  //     return res.json({
  //       success: true,
  //       message: 'Thank you',
  //       vot: (vot),
  //       vote: vote
  //     });
  //   })
  //   .catch(err => console.log(err))
  // new Vote(newVote)
  //   .save()
  //   .then(vote => {
  //     pusher.trigger('os-poll', 'os-vote', {
  //       points: parseInt(vote.points),
  //       os: vote.os,
  //       test: 'checkpoint'
  //     });
  //     const vot = Vote.find({}).then(votes => {
  //       //console.log(votes);
  //       return votes;
  //     });
  //     console.log(vot);
  //     return res.json({
  //       success: true,
  //       message: 'Thank you',
  //       vot
  //     });
  //   })
});

module.exports = router;