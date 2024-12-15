const { checkAccessToken } = require("./jwtmodule");

function checkAuth(accesstoken) {

    const check = checkAccessToken(accesstoken);
        
    if(check === "error"){
        return false;
    }else{
        return true;
    }
}


module.exports.checkAuth = checkAuth;