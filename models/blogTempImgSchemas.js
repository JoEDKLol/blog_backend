const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

const BlogTempImgSchemas = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:true
    },
    temp_num : {
        type: String,
        required: true,
        index:true
    },
    img : {
        type: String,
        required: true,
        index:true
    },
    img_url : {
        type: String,
    },
    thumbImg_url : {
        type: String,
    },
    blog_seq : {
        type: Number,
        default: -1,
        index:true
    },
    regdate : {
        type: Date,
        default: Date.now
    },
    reguser : {
        type: String,
        required: true
    },
    upddate : {
        type: Date,
        default: Date.now
    },
    upduser : {
        type: String,
        required: true
    }

})

const BlogTempImgs=mongoose.model('blogTempImg',BlogTempImgSchemas)
module.exports=BlogTempImgs