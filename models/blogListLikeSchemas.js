const mongoose = require('mongoose')

const blogListLikeSchemas = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        index:true
    },
    blog_list_seq : {
        type: Number,
        required: true,
        index:true
    },

    like_yn : {
        type: String,
        default: "n"
    },
    
    blogListInfo: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "blogList", 
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


const BlogListLikes=mongoose.model('blogListLike',blogListLikeSchemas)
module.exports=BlogListLikes