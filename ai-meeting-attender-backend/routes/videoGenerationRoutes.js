const express = require('express');
const router = express.Router();
const { generateVideoAndAudio } = require('../controllers/videoGenerationController');
const { generateAIAgent } = require('../controllers/generateVideoAndAudio');

router.post('/generateVideoAndAudio', generateVideoAndAudio);
router.post('/generateAIAgent/:id', generateAIAgent);

module.exports = router;