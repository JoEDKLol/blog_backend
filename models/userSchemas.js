const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        index:{unique:true}
    },
    name : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    blogid : {
        type: mongoose.Schema.ObjectId,
        index:{unique:false}
    },
    loginattemptscnt : {
        type: Number,
        default: 0
    },
    role : {
        type: String,
        enum: ['administrator','user'],
        default: 'user'
    },
    accountlock : {
        type: String,
        default: "n"
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

UserSchema.pre("save", function(next){

    var user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
          });
        });
      } else {
        next();
      }

})

UserSchema.pre("updateOne", function(next){

    var user = this;
    if (user._update.password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user._update.password, salt, function (err, hash) {
                if (err) return next(err);
                user._update.password = hash;
                next();
            });
        });
      } else {
        next();
      }
})

UserSchema.methods.comparePassword = async function (plainPassword) {
    let res = await bcrypt.compare(plainPassword, this.password);
    return res;
};

const Users=mongoose.model('user',UserSchema)
module.exports=Users