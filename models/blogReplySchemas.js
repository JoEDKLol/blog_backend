const mongoose = require('mongoose')

const blogReplySchemas = mongoose.Schema({
    blog_seq : { 
        type: Number,
        required: true,
        index:true
    },
    blog_list_seq : { 
        type: Number,
        required: true,
        index:true
    },
    blog_comment_seq : {
        type: Number,
        required: true,
        index:true
    },
    blog_comment_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:true
    },
    seq:{
        type: Number,
        index:true,
    },
    email : {
        type: String,
        required: true,
        index:true
    },
    reply : {
        type: String,
    },

    bloginfo: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "blogInfo", 
    },
    
    deleteyn : {
        type: String,
        default: "n"
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


const BlogReplies=mongoose.model('blogReply',blogReplySchemas)
module.exports=BlogReplies