const Meeting = require('../models/Meeting');
const multer = require('multer');
const path = require('path');
const { uploadFile, getFileStream, deleteFile } = require('../config/gridfs');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files (jpg, jpeg, png) are allowed!'));
    }
}).single('userPhoto');

// Create a new meeting
exports.createMeeting = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a photo'
                });
            }

            // Upload file to GridFS
            const fileInfo = await uploadFile(req.file);

            const meeting = new Meeting({
                meetingLink: req.body.meetingLink,
                meetingTime: new Date(req.body.meetingTime),
                meetingName: req.body.meetingName,
                photo: {
                    fileId: fileInfo.fileId,
                    filename: fileInfo.filename,
                    contentType: fileInfo.contentType
                }
            });

            await meeting.save();

            res.status(201).json({
                success: true,
                data: meeting,
                message: 'Meeting scheduled successfully'
            });
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error scheduling meeting'
        });
    }
};

// Get all meetings
exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ meetingTime: 1 });
        res.status(200).json({
            success: true,
            data: meetings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single meeting
exports.getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }
        res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get meeting photo
exports.getMeetingPhoto = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting || !meeting.photo) {
            return res.status(404).json({
                success: false,
                message: 'Meeting photo not found'
            });
        }

        res.set('Content-Type', meeting.photo.contentType);
        const downloadStream = getFileStream(meeting.photo.fileId);
        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update meeting status
exports.updateMeetingStatus = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete meeting and its photo
exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Delete photo from GridFS
        await deleteFile(meeting.photo.fileId);
        
        // Delete meeting document
        await meeting.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 