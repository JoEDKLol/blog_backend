const mongoose = require('mongoose')

const SubCategorySchema = mongoose.Schema({
    seq:{
        type: Number,
        index:true,
    },
    blog_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:true
    },
    m_category_seq : {
        type: Number,
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
    expression_method: {
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


const SubCategories=mongoose.model('subCategory',SubCategorySchema)
module.exports=SubCategories