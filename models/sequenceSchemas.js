const mongoose = require('mongoose')


const SequenceSchema = mongoose.Schema({
    _id : {
        type: String,
    },
    seq_value : {
        type: Number,
    },
    referenceCollection : {
        type:String
    }
})


const Sequences=mongoose.model('Sequence',SequenceSchema)
module.exports=Sequences