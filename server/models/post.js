import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    imageUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // если приедтся достаь автора, нужен его айди, айди в монге это обджек айди, прописывается таким образом
        ref: 'User',
        // реф - это референс - ссылка на схему, в которой искать
        required: true,
    },

}, {timestamps: true});

export default mongoose.model('Post', PostSchema);