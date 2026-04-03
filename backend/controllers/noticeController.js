const Notice = require('../models/Notice');
const fs = require('fs');
const path = require('path');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private
const createNotice = async (req, res) => {
    const { title, description, date } = req.body;
    let attachment = null;

    if (req.file) {
        attachment = `/uploads/${req.file.filename}`;
    }

    try {
        const notice = new Notice({
            title,
            description,
            date: date || undefined,
            attachment
        });

        const createdNotice = await notice.save();
        res.status(201).json(createdNotice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private
const updateNotice = async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            notice.title = title || notice.title;
            notice.description = description || notice.description;
            notice.date = date || notice.date;

            if (req.file) {
                // Delete old attachment if exists
                if (notice.attachment) {
                    const oldPath = path.join(__dirname, '../..', notice.attachment);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                notice.attachment = `/uploads/${req.file.filename}`;
            }

            const updatedNotice = await notice.save();
            res.json(updatedNotice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            // Delete attachment from disk
            if (notice.attachment) {
                const attachmentPath = path.join(__dirname, '../..', notice.attachment);
                if (fs.existsSync(attachmentPath)) fs.unlinkSync(attachmentPath);
            }
            await notice.deleteOne();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getNotices,
    createNotice,
    updateNotice,
    deleteNotice
};
