const mongoose = require('mongoose')

const BlogListSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:true}
    },
    blog_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:true}
    },
    m_category_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    s_category_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    title : {
        type: String,
    },
    content : {
        type: String,
    },
    public : {          //게시물 공개 여부
        type: String,
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


const BlogLists=mongoose.model('blogList',BlogListSchema)
module.exports=BlogLists