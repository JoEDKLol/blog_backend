const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken');

function retFreshToken(id, email) {
  let refeshtoken;
  try{
    refeshtoken = jwt.sign({
      id:id,
      email:email,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"30 days",
    });
  }catch(e){
    console.log(e);
  }
  
  return  refeshtoken;
}

function retAccessToken(id, email) {
  let accessToken;
  try{
    accessToken = jwt.sign({
      id:id,
      email:email,

    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"30m",
    })
  }catch(e){
    console.log(e);
  }
  
  return  accessToken;
}

function checkRefreshToken(refreshtoken){
  let checkToken;
  try{
    checkToken = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
  }catch(e){
    checkToken = "";
  }
  return checkToken;
}

function checkAccessToken(accesstk){
  let checkToken;
  try{
    checkToken = jwt.verify(accesstk, process.env.ACCESS_TOKEN_SECRET);
  }catch(e){
    checkToken = "";
  }
  return checkToken;
}

module.exports.retFreshToken = retFreshToken;
module.exports.retAccessToken = retAccessToken;
module.exports.checkRefreshToken = checkRefreshToken;
module.exports.checkAccessToken = checkAccessToken;