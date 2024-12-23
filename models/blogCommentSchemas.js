const mongoose = require('mongoose')

const blogCommentSchemas = mongoose.Schema({
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
    seq:{
        type: Number,
        index:true,
    },
    email : {
        type: String,
        required: true,
        index:true
    },
    comment : {
        type: String,
    },

    bloginfo: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "blogInfo", 
    },

    repliescnt : {
        type: Number,
        default: 0
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


const BlogComments=mongoose.model('blogComment',blogCommentSchemas)
module.exports=BlogComments