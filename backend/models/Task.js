const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic: String,
    content: String,
    status: { type: String, enum: ['incomplete', 'complete'], default: 'incomplete' },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Task', TaskSchema);