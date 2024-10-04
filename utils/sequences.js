const Sequences = require("../models/sequenceSchemas");

const getSequence = async (sequenceId) => {
    try{
        const autoInc = await Sequences.findOneAndUpdate(
            {_id:sequenceId},
            {$inc: {seq_value:1}},
            {new: true}
        );
        return autoInc.seq_value;
            
    }catch(e){
        return "error"
    }
    

}

module.exports.getSequence = getSequence;