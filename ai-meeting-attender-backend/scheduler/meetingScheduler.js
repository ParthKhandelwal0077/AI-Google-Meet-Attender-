const cron = require('node-cron');
const moment = require('moment');
const Meeting = require('../models/Meeting'); // Import MongoDB Model
const { joinMeeting } = require('../utils/puppeteerHelper');

// Function to fetch meetings and schedule them
async function fetchAndScheduleMeetings() {
    try {
        const now = new Date();
        const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000); // Next 15 mins

        // Fetch meetings scheduled to start in the next 15 minutes
        const meetings = await Meeting.find({
            meetingTime: {
                $gte: now,
                $lte: fifteenMinutesLater
            }
        });

        if (meetings.length > 0) {
            meetings.forEach(meeting => {
                console.log(`Scheduling meeting: ${meeting.meetingLink} at ${meeting.meetingTime}`);

                // Schedule a precise execution for each meeting at its exact time
                scheduleExactMeeting(meeting);
            });
        } else {
            console.log('No meetings scheduled in the next 15 minutes.');
        }
    } catch (error) {
        console.error('Error fetching meetings:', error);
    }
}

// Function to trigger meeting attendance at the exact time
function scheduleExactMeeting(meeting) {
    const now = new Date();
    const meetingTime = new Date(meeting.meetingTime);
    const delay = meetingTime.getTime() - now.getTime();

    if (delay > 0) {
        console.log(`Meeting scheduled in ${Math.round(delay / 60000)} minutes.`);

        setTimeout(() => {
            joinMeeting(meeting.meetingLink, meeting.meetingName)


        }, delay);
    } else {
        console.log('Meeting time has already passed. Skipping.');
    }
}

// Run the scheduler every 5 minutes
cron.schedule('*/5 * * * *', fetchAndScheduleMeetings);

module.exports = { fetchAndScheduleMeetings };
