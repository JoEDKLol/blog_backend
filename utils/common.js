
const mainBoardSPage = 12;
const commentPage = 10;
const replyPage = 5;

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

    if(code==="2132"){
        arr.push("imgUpload imgbb fail"); 
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

    if(code==="2180"){
        arr.push("blog major category update success"); 
        arr.push("y"); 
    }

    if(code==="2181"){
        arr.push("blog major category update fail"); 
        arr.push("n"); 
    }

    if(code==="2190"){
        arr.push("blog major category delete success"); 
        arr.push("y"); 
    }

    if(code==="2191"){
        arr.push("blog major category delete fail"); 
        arr.push("n"); 
    }

    if(code==="2200"){
        arr.push("blog sub category update success"); 
        arr.push("y"); 
    }

    if(code==="2200"){
        arr.push("blog sub category update fail"); 
        arr.push("n"); 
    }

    if(code==="2210"){
        arr.push("blog sub category delete success"); 
        arr.push("y"); 
    }

    if(code==="2211"){
        arr.push("blog sub category delete fail"); 
        arr.push("n"); 
    }

    if(code==="2220"){
        arr.push("blog list delete success"); 
        arr.push("y"); 
    }

    if(code==="2221"){
        arr.push("blog list delete fail"); 
        arr.push("n"); 
    }

    if(code==="2230"){
        arr.push("blog comment write success"); 
        arr.push("y"); 
    }

    if(code==="2231"){
        arr.push("blog comment write fail"); 
        arr.push("n"); 
    }

    if(code==="2240"){
        arr.push("blog comment search success"); 
        arr.push("y"); 
    }

    if(code==="2241"){
        arr.push("blog comment search fail"); 
        arr.push("n"); 
    }

    if(code==="2250"){
        arr.push("blog comment delete success"); 
        arr.push("y"); 
    }

    if(code==="2251"){
        arr.push("blog comment delete fail"); 
        arr.push("n"); 
    }

    if(code==="2260"){
        arr.push("blog like update success"); 
        arr.push("y"); 
    }

    if(code==="2261"){
        arr.push("blog like update fail"); 
        arr.push("n"); 
    }

    if(code==="2270"){
        arr.push("blog like search success"); 
        arr.push("y"); 
    }

    if(code==="2271"){
        arr.push("blog like search fail"); 
        arr.push("n"); 
    }

    if(code==="2280"){
        arr.push("blog comment update success"); 
        arr.push("y"); 
    }

    if(code==="2281"){
        arr.push("blog comment update fail"); 
        arr.push("n"); 
    }

    if(code==="2290"){
        arr.push("blog reply write success"); 
        arr.push("y"); 
    }

    if(code==="2291"){
        arr.push("blog reply write fail"); 
        arr.push("n"); 
    }

    if(code==="2300"){
        arr.push("blog reply search success"); 
        arr.push("y"); 
    }

    if(code==="2310"){
        arr.push("blog reply search fail"); 
        arr.push("n"); 
    }

    if(code==="2320"){
        arr.push("blog reply update success"); 
        arr.push("y"); 
    }

    if(code==="2321"){
        arr.push("blog reply update fail"); 
        arr.push("n"); 
    }

    if(code==="2330"){
        arr.push("blog reply delete success"); 
        arr.push("y"); 
    }

    if(code==="2331"){
        arr.push("blog reply delete fail"); 
        arr.push("n"); 
    }

    if(code==="2340"){
        arr.push("aboutme update success"); 
        arr.push("y"); 
    }

    if(code==="2341"){
        arr.push("aboutme update fail"); 
        arr.push("n"); 
    }

    if(code==="2350"){
        arr.push("aboutme search success"); 
        arr.push("y"); 
    }

    if(code==="2351"){
        arr.push("aboutme search fail"); 
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
module.exports.commentPage = commentPage;
module.exports.replyPage = replyPage;

