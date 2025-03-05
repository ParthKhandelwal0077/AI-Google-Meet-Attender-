import { useState } from 'react';
import { useCreateMeetingMutation } from '../features/api/meetingApiSlice';

export default function MeetingForm() {
  const [meetingData, setMeetingData] = useState({
    meetingLink: '',
    meetingTime: '',
    meetingName: '',  // New field to store the name
    userPhoto: null
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [createMeeting] = useCreateMeetingMutation();

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      
      setMeetingData({ ...meetingData, userPhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const validateMeetingLink = (link) => {
    return link.startsWith('https://meet.google.com/') || 
           link.startsWith('http://meet.google.com/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateMeetingLink(meetingData.meetingLink)) {
        throw new Error('Please enter a valid Google Meet link');
      }

      const meetingTime = new Date(meetingData.meetingTime);
      if (meetingTime < new Date()) {
        throw new Error('Meeting time cannot be in the past');
      }

      if (!meetingData.meetingName) {
        throw new Error('Please enter a name to join the meeting');
      }

      const formData = new FormData();
      formData.append('meetingLink', meetingData.meetingLink);
      formData.append('meetingTime', meetingData.meetingTime);
      formData.append('meetingName', meetingData.meetingName);  // Send name to backend
      formData.append('userPhoto', meetingData.userPhoto);

      const result = await createMeeting(formData).unwrap();
      console.log('Meeting scheduled successfully:', result);

      alert('Meeting scheduled successfully!');
      setMeetingData({
        meetingLink: '',
        meetingTime: '',
        meetingName: '',
        userPhoto: null
      });
      setPhotoPreview('');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError(error.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="divide-y divide-gray-200">
        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            AI Meeting Attender
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Google Meet Link</label>
              <input
                type="url"
                required
                value={meetingData.meetingLink}
                onChange={(e) => setMeetingData({ ...meetingData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Meeting Time</label>
              <input
                type="datetime-local"
                required
                value={meetingData.meetingTime}
                onChange={(e) => setMeetingData({ ...meetingData, meetingTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                required
                value={meetingData.meetingName}
                onChange={(e) => setMeetingData({ ...meetingData, meetingName: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                required
              />
              <label htmlFor="photo-upload" className="w-full flex items-center justify-center px-6 py-3 border">
                {meetingData.userPhoto ? 'Change Photo' : 'Upload Photo'}
              </label>
              {photoPreview && (
                <div className="mt-4 flex justify-center">
                  <img src={photoPreview} alt="Preview" className="h-48 w-48 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
