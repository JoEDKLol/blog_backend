const mongoose = require('mongoose')

const UserPwdChgReqSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:true}
    },
    email_number : {
        type: Number,
        required: true
    },
    delete_yn : {
        type: String,
        default: "n"
    },
    regDate : {
        type: Date,
        default: Date.now
    },
    regUser : {
        type: String,
        required: true
    },
    updDate : {
        type: Date,
        default: Date.now
    },
    updUser : {
        type: String,
        required: true
    }

})

const UserPwdChgReq=mongoose.model('userPwdChgReq',UserPwdChgReqSchema)
module.exports=UserPwdChgReq