
const mainBoardSPage = 9;

function sendObjSet(code, resObj) {
    const obj = {
        code:code, 
        message:returnCodeContents(code)[0],
        success:returnCodeContents(code)[1],
        resObj:resObj
    }
    return obj;
}

function returnCodeContents(code){
    let arr = [];
    
    if(code==="1000"){ 
        arr.push("signup success"); 
        arr.push("y"); 
    }

    if(code==="1001"){ 
        arr.push("email duplecate"); 
        arr.push("n"); 
    }

    if(code==="1010"){ 
        arr.push("email exists"); 
        arr.push("y"); 
    }

    if(code==="1011"){ 
        arr.push("email not exists"); 
        arr.push("n"); 
    }

    if(code==="1012"){ 
        arr.push("email verify invalid (3 minutes or more)"); 
        arr.push("n"); 
    }

    if(code==="1020"){ 
        arr.push("email verify number save"); 
        arr.push("y"); 
    }

    if(code==="1030"){ 
        arr.push("email verify number success"); 
        arr.push("y"); 
    }

    if(code==="1031"){ 
        arr.push("email verify number failed"); 
        arr.push("n"); 
    }

    if(code==="1040"){ 
        arr.push("password changed success"); 
        arr.push("y"); 
    }

    if(code==="1041"){ 
        arr.push("password changed failed"); 
        arr.push("n"); 
    }

    if(code==="1050"){ 
        arr.push("signin success"); 
        arr.push("y"); 
    }

    if(code==="1051"){ 
        arr.push("signin failed"); 
        arr.push("n"); 
    }

    if(code==="1052"){ 
        arr.push("Login Attempts Exceeded"); 
        arr.push("n"); 
    }

    if(code==="2000"){
        arr.push("request access-token success"); 
        arr.push("y"); 
    }

    if(code==="2001"){
        arr.push("request access-token failed"); 
        arr.push("n"); 
    }

    if(code==="2002"){
        arr.push("request access-token failed-refreshTokenError"); 
        arr.push("n"); 
    }

    if(code==="2010"){
        arr.push("request access-token-check success"); 
        arr.push("y"); 
    }

    if(code==="2011"){
        arr.push("request access-token-check failed"); 
        arr.push("n"); 
    }

    if(code==="2020"){
        arr.push("request logout success"); 
        arr.push("y"); 
    }

    if(code==="2021"){
        arr.push("request logout failed"); 
        arr.push("n"); 
    }

    if(code==="2100"){
        arr.push("get bloglist success"); 
        arr.push("y"); 
    }

    if(code==="2101"){
        arr.push("get bloglist fail"); 
        arr.push("n"); 
    }

    if(code==="2110"){
        arr.push("get blogInfo success"); 
        arr.push("y"); 
    }

    if(code==="2111"){
        arr.push("get blogInfo fail"); 
        arr.push("n"); 
    }

    if(code==="2120"){
        arr.push("get bloglistEa success"); 
        arr.push("y"); 
    }

    if(code==="2121"){
        arr.push("get bloglistEa fail"); 
        arr.push("n"); 
    }

    if(code==="2130"){
        arr.push("imgUpload success"); 
        arr.push("y"); 
    }

    if(code==="2131"){
        arr.push("imgUpload fail"); 
        arr.push("n"); 
    }

    if(code==="2140"){
        arr.push("write success"); 
        arr.push("y"); 
    }

    if(code==="2141"){
        arr.push("write fail"); 
        arr.push("n"); 
    }

    if(code==="2150"){
        arr.push("blog detail success"); 
        arr.push("y"); 
    }

    if(code==="2151"){
        arr.push("blog detail fail"); 
        arr.push("n"); 
    }

    if(code==="2160"){
        arr.push("blog imgUpload success"); 
        arr.push("y"); 
    }

    if(code==="2161"){
        arr.push("blog imgUpload fail"); 
        arr.push("n"); 
    }

    if(code==="2170"){
        arr.push("blog info update success"); 
        arr.push("y"); 
    }

    if(code==="2171"){
        arr.push("blog info update fail"); 
        arr.push("n"); 
    }

    return arr
}

const getRandomNumber = (n) => {

    let retNum = "";
    for (let i = 0; i < n; i++) {
        retNum += Math.floor(Math.random() * 10)
    }
    return retNum;

}




module.exports.sendObjSet = sendObjSet;
module.exports.getRandomNumber = getRandomNumber;
module.exports.mainBoardSPage = mainBoardSPage;