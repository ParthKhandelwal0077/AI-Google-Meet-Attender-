const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingLink: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.startsWith('https://meet.google.com/') || v.startsWith('http://meet.google.com/');
            },
            message: 'Invalid Google Meet link format'
        }
    },
    meetingTime: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Meeting time must be in the future'
        }
    },
    meetingName: {  // New field to store the name that will be used to join the meeting
        type: String,
        required: true
    },
    photo: {
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
meetingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
