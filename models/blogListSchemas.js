const mongoose = require('mongoose')

const BlogListSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:true
    },
    blog_seq : {
        type: Number,
        required: true,
        index:true
    },
    seq:{
        type: Number,
        required: true,
        index:true,
    },
    m_category_seq : {
        type: String,
        // type: mongoose.Schema.ObjectId,
        // required: true,
    },
    s_category_seq : {
        type: String,
        // type: mongoose.Schema.ObjectId,
        // required: true,
    },
    title : {
        type: String,
    },
    pic : {             //first pic url
        type: String,
    },
    temp_num : { //from blogTempImgSchemas.js's temp_num
        type: String,
        required: true,
        index:true
    },
    content : {
        type: String,
    },
    public : {          //게시물 공개 여부
        type: String,
    },
    hashtag : [
        {
            type: String,
            index: true,
        }
    ],
    commentscnt : {
        type: Number,
        default: 0
    },
    likecnt : {
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


const BlogLists=mongoose.model('blogList',BlogListSchema)
module.exports=BlogLists