const mongoose = require('mongoose')

const EmailVerificationSchemas = mongoose.Schema({
    email : {
        type: String,
        required: true,
        index:{unique:false}
    },
    verifynumber:{
        type: String,
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

const EmailVerifications=mongoose.model('emailVerification',EmailVerificationSchemas)
module.exports=EmailVerifications