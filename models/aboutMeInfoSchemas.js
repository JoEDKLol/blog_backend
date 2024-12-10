const mongoose = require('mongoose')

const aboutMeInfoSchemas = mongoose.Schema({
    
    user_id : {
        type: mongoose.Schema.ObjectId,
        index:{unique:false}
    },
    blog_id : {
        type: mongoose.Schema.ObjectId,
        index:{unique:false}
    },
    blog_seq : {
        type: Number,
        index:{unique:false}
    },
    temp_num : { //from blogTempImgSchemas.js's temp_num
        type: String,
        index:true
    },
    aboutme_thumbnailimg : {
        type: String,
    },
    aboutme_img : {
        type: String,
    },
    aboutme_name : {
        type: String,
    },
    jobtitle : {
        type: String,
    },
    summary : {
        type: String,
    },
    aboutme_email : {
        type: String,
    },
    aboutme_phone : {
        type: String,
    },
    aboutme_linkedin : {
        type: String,
    },
    aboutme_address : {
        type: String,
    },
    content : {
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


const AboutMeInfos=mongoose.model('aboutmeinfo',aboutMeInfoSchemas)
module.exports=AboutMeInfos