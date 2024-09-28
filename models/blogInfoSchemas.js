const mongoose = require('mongoose')

const BlogInfoSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        index:{unique:true}
    },
    blogtitle : {
        type: String,
    },
    blogimg : {
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


const BlogInfos=mongoose.model('blogInfo',BlogInfoSchema)
module.exports=BlogInfos