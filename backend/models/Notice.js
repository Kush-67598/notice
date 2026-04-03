const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Notice title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Notice description is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    attachment: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
