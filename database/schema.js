const mongoose = require('./db');

const Schema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        unique: true,
    },
    heading: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    smallblog: {
        type: String,
        required: true,
        trim: true,
    },
    bigblog: {
        type: String,
        required: true,
        trim: true,
    }
})

const allblogs = new mongoose.model('allblogs', Schema);


const adminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const admin = new mongoose.model('admin', adminSchema)


module.exports = { allblogs, admin };