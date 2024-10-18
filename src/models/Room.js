const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    capacity: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String, // Armazena o nome do criador
        required: true,
    },
    creatorId: {
        type: String, // Armazena o ID do criador
        required: true,
    },
});

module.exports = mongoose.model("Room", roomSchema);
