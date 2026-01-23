const mongoose = require('mongoose');
const SlideSchema = new mongoose.Schema({
    media: {
    mediaType: { type: String, required: true ,enum:['1','2','3']},
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    mediaUrl: { type: String, required: true },
    },
    captionT: { type: String, default: "" },
    captionB: { type: String, default: "" },
    bullets: { type: [String], default: [] },
    mediaDuration: { type: Number, default: 0 },
    style: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Styles',
        required: true 
    },
    // Slide Schedule
    schedule: {
        duration: { type: Number, default: 0 }, // in seconds
        sDate: { type: String, default: '' },
        eDate: { type: String, default: '' },
      },
    socialLinks: {
    type: [String], // Array of URLs or identifiers for social links.
    default: [],
    },
});
module.exports = mongoose.model('Slides', SlideSchema);

