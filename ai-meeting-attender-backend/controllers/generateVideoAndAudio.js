// const axios = require('axios');
// const Meeting = require('../models/Meeting');

// exports.generateAIAgent = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const meeting = await Meeting.findById(id);

//         if (!meeting) {
//             return res.status().json({
//                 success: false,
//                 message: 'Meeting not found'
//             });
//         }

//         const photoUrl = `http://localhost:3000/api/meetings/${id}/photo`;

//         const payload = {
//             presenter: {
//                 type: 'talk',
//                 voice: {
//                     type: 'microsoft',
//                     voice_id: 'en-US-JennyMultilingualV2Neural'
//                 },
//                 thumbnail: photoUrl,
//                 source_url: photoUrl
//             },
//             llm: {
//                 type: 'openai',
//                 provider: 'openai',
//                 model: 'gpt-3.5-turbo',
//                 instructions: 'You are Scarlett, an AI designed to assist with information about Louvre'
//             },
//             preview_name: 'Scarlett'
//         };

//         const response = await axios.post('https://api.d-id.com/agents', payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.D_ID_API_KEY}`
//             }
//         });

//         res.status(200).json({
//             success: true,
//             data: response.data,
//             message: 'AI agent created successfully'
//         });
//     } catch (error) {
//         console.error('Error generating AI agent:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Error generating AI agent'
//         });
//     }
// };
