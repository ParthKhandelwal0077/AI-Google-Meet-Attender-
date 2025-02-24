const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getMeetings,
    getMeeting,
    getMeetingPhoto,
    updateMeetingStatus,
    deleteMeeting
} = require('../controllers/meetingController');

// Meeting routes
router.post('/', createMeeting);
router.get('/', getMeetings);
router.get('/:id', getMeeting);
router.get('/:id/photo', getMeetingPhoto);
router.patch('/:id/status', updateMeetingStatus);
router.delete('/:id', deleteMeeting);

module.exports = router; 