const mongoose = require('mongoose')

const MajorCategorySchema = mongoose.Schema({
    seq:{
        type: Number,
        index:true,
    },
    blog_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:true
    },
    
    categoryNm: {
        type: String,
    },

    order : {
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


const MajorCategories=mongoose.model('majorCategory',MajorCategorySchema)
module.exports=MajorCategories