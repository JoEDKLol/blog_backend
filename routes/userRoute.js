const express=require('express')
const multer=require('multer')
const userRoute=express.Router()
let getFields=multer()
const Users = require("../models/userSchemas");
const BlogInfos = require("../models/blogInfoSchemas");
const EmailVerifications = require("../models/emailVerificationSchemas");
const ObjectId = require("mongoose").Types.ObjectId;
const commonModules = require("../utils/common");
const jwtModules = require("../utils/jwtmodule");
const { default: mongoose } = require('mongoose')
const db = mongoose.connection;
const sequence = require("../utils/sequences");

userRoute.get("/test", getFields.none(), async (request, response) => {
    try {
        // console.log("여기??");
        response.send({
            user:{
                name:'test'
                , email:'test@test.com'
            }

        });
    } catch (error) {
        response.status(500).send(error);
    }
});
userRoute.post("/signin", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        let userData = await Users.findOne({email:request.body.email});
        // console.log(userData);
        if(!userData){
            sendObj = commonModules.sendObjSet("1051");
        }

        if(userData){
            //password compare
            let res = await userData.comparePassword(request.body.password);
            
            if(!res){ //패스워드 인증 실패시 로그인 시도횟수가 10미만이면 시도횟수 증가
                if(userData.loginattemptscnt >= 10){
                    sendObj = commonModules.sendObjSet("1051");
                }else{
                    let upRes = await Users.updateOne({_id:userData._id}
                        ,{"loginattemptscnt":userData.loginattemptscnt+1})
                    sendObj = commonModules.sendObjSet("1051");
                }
            }else{
                if(userData.loginattemptscnt >= 10){ //로그인 시도횟수가 10이상이면 비밀번호 변경 해야 한다.
                    sendObj = commonModules.sendObjSet("1052");
                }else{ 
                    //로그인성공시 토큰 발급해준다. 
                    //01. 리프레쉬토큰은 header에 발급
                    if(userData.loginAttemptsCnt > 0){
                        let upRes = await Users.updateOne({_id:userData._id}
                            ,{"loginattemptscnt":0})
                    }
                    
                    // const accesstoken = jwtModules.retAccessToken(userData._id, userData.email);
                    const refreshtoken = jwtModules.retFreshToken(userData._id, userData.email);
                    const userObj = {
                        id:userData._id,
                        email:userData.email,
                        blog_seq:userData.blog_seq
                    }
                    //accesstoken, refreshtoken 헤더에 셋팅
                    // response.setHeader("accesstoken", accesstoken);
                    response.setHeader("refreshtoken", refreshtoken);

                    //refreshtoken 쿠키에 셋팅
                    /*
                    //maxAge : 만료 시간을 밀리초 단위로 설정
                    //expires : 만료 날짜를 시간으로 설정
                    //path : cookie의 경로 default “/“
                    //domain : 도메인 네임
                    //secure : https에서만 cookie 사용
                    //httpOnly : 웹서버를 통해서만 cookie 접근 */
                    // const expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 30); // 24 hour 30일
                    // response.cookie(
                    //     'refreshtoken', refreshtoken, {
                    //         expires:expiryDate, 
                    //         httpOnly: true,

                    //     }
                    // );
                    // console.log(response);
                    sendObj = commonModules.sendObjSet("1050", userObj);
                }
            }

        }

        // console.log(sendObj);
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

userRoute.post("/googlesignin", getFields.none(), async (request, response) => {

    try {
        let sendObj = {};
        
        let userData = await Users.findOne({email:request.body.email});
        
        if(!userData){ //new user register
            //blogId
            let blogSeq = await sequence.getSequence("blog_seq");
            let userEmail = request.body.email;
            let emailpre = userEmail.substring(0, userEmail.indexOf("@"));

            const session = await db.startSession();
            // 2. 트렌젝션 시작
            session.startTransaction();
            
            // 3. 
            const blogObj = {
                email:request.body.email,
                seq:blogSeq,
                name:emailpre,
                reguser:request.body.email,
                upduser:request.body.email
            }

            const newBlogInfos =new BlogInfos(blogObj);
            let resBloginfos=await newBlogInfos.save();
            
            request.body.reguser = request.body.email;
            request.body.upduser = request.body.email;
            request.body.blog_id = resBloginfos._id;
            request.body.blog_seq = resBloginfos.seq;

            const newUsers =new Users(request.body);
            let resusers=await newUsers.save();
            
            // 4. commit
            await session.commitTransaction();
            // 5. 세션 끝내기
            session.endSession();

            const refreshtoken = jwtModules.retFreshToken(resusers._id, resusers.email);
            const userObj = {
                id:resusers._id,
                email:resusers.email,
                blog_seq:resusers.blog_seq
            }
            console.log(userObj);
            response.setHeader("refreshtoken", refreshtoken);
            sendObj = commonModules.sendObjSet("1050", userObj);
            
        }else{
            const refreshtoken = jwtModules.retFreshToken(userData._id, userData.email);
            const userObj = {
                id:userData._id,
                email:userData.email,
                blog_seq:userData.blog_seq
                
            }
            response.setHeader("refreshtoken", refreshtoken);
            sendObj = commonModules.sendObjSet("1050", userObj);
        }

        console.log(sendObj);
        
        response.status(200).send({
            sendObj
        });

    }catch (error) {
        console.log(error);
        response.status(500).send(error);
    }

});
userRoute.post("/signup", getFields.none(), async (request, response) => {
    try {
        //01. email duplicate check
        let userData = await Users.findOne({email:request.body.email});
        let sendObj = {};
        
        
        if(!userData){
            //blogId
            let blogSeq = await sequence.getSequence("blog_seq");
            let userEmail = request.body.email;
            let emailpre = userEmail.substring(0, userEmail.indexOf("@"));

            const session = await db.startSession();
            // 2. 트렌젝션 시작
            session.startTransaction();
            
            // 3. 
            const blogObj = {
                email:request.body.email,
                seq:blogSeq,
                name:emailpre,
                reguser:request.body.email,
                upduser:request.body.email
            }

            const newBlogInfos =new BlogInfos(blogObj);
            let resBloginfos=await newBlogInfos.save();
            
            request.body.reguser = request.body.email;
            request.body.upduser = request.body.email;
            request.body.blog_id = resBloginfos._id;
            request.body.blog_seq = resBloginfos.seq;

            const newUsers =new Users(request.body);
            let resusers=await newUsers.save();
            
            // 4. commit
            await session.commitTransaction();
            // 5. 세션 끝내기
            session.endSession();
            sendObj = commonModules.sendObjSet("1000"); 
            
        }else{
            sendObj = commonModules.sendObjSet("1001"); //email duplecate
        }

        response.status(200).send({
            sendObj
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

userRoute.post("/emailverify", getFields.none(), async (request, response) => {
    let sendObj = {};
    try{
        let userData = await Users.findOne({email:request.body.email});
        //01. 최근에 이메일 인증 이력을 조회한다.
        //02. 인증이력이 있는 경우 시간을 조회하고 인증이 5분 
        //    이내인경우 3분 이후에 이메일 인증을 할고 알려준다.
        //03. 3분이 넘은 경우 인증이력에 저장한다. 프론트에서 
        //    email이 전송된다.
        if(userData){ //기존 사용자에 email 있음
            let emailVerifyData = await EmailVerifications.aggregate(
                [   
                    {
                        $match:{ "email":request.body.email}
                    },
                    {
                        $project: { "email": 1, "regdate": 1 }
                    },
                    {
                        $sort:{_id:-1}
                    },
                    {
                        $limit:1
                    }
                    // {
                    //     $addFields : {"currentTime" : Date()}
                    // }
                ]   
            );

            if(emailVerifyData[0]){
                const searchDate = new Date(emailVerifyData[0].regdate)
                const currentDate = new Date();
                const diffMSec = currentDate.getTime() - searchDate.getTime()
                const diffMin = diffMSec / (1000);

                if(diffMin < 180){ //3분 미만
                    sendObj = commonModules.sendObjSet("1012");
                }else{
                    const emailVObj = {
                        email:request.body.email,
                        // verifynumber:commonModules.getRandomNumber(6),
                        reguser:request.body.email,
                        upduser:request.body.email
                    }
                    const newEmailVerifications = new EmailVerifications(emailVObj);
                    const resEmailVerifications = await newEmailVerifications.save();
                    const resEmailVerificationsId = {
                        id:resEmailVerifications._id,
                    }
                    
                    sendObj = commonModules.sendObjSet("1010", resEmailVerificationsId);
                }

            }else{
                const emailVObj = {
                    email:request.body.email,
                    // verifynumber:commonModules.getRandomNumber(6),
                    reguser:request.body.email,
                    upduser:request.body.email
                }
    
                const newEmailVerifications = new EmailVerifications(emailVObj);
                let resEmailVerifications = await newEmailVerifications.save();
                const resEmailVerificationsId = {
                    id:resEmailVerifications._id,
                }
                sendObj = commonModules.sendObjSet("1010", resEmailVerificationsId);
            }

            
        
        }else{ //기존 사용자에 email 없음
            sendObj = commonModules.sendObjSet("1011");
        }
        
        response.status(200).send({
            sendObj
        });

    }catch(error){
        response.status(500).send(error);
    }

});

userRoute.post("/emailverifysave", getFields.none(), async (request, response) => {
    let sendObj = {};
    try{
        let date = new Date().toISOString();
        let updateRes = await EmailVerifications.updateOne(
            {_id:new ObjectId(request.body.id)},
            {  
                "verifynumber":request.body.number, 
                "updUser":request.body.to_email,
                "updDate":date,
            }
        )
        sendObj = commonModules.sendObjSet("1020");
        response.status(200).send({
            sendObj
        });
        
    }catch(error){
        response.status(500).send(error);
    }

});

userRoute.post("/emailverifynumber", getFields.none(), async (request, response) => {
    let sendObj = {};
    try{
        let emailVerifyData = await EmailVerifications.aggregate(
            [   
                {
                    $match:{ "email":request.body.email}
                },
                {
                    $project: { "verifynumber": 1}
                },
                {
                    $sort:{_id:-1}
                },
                {
                    $limit:1
                }
            ]   
        );

        if(emailVerifyData[0].verifynumber === request.body.number){
            sendObj = commonModules.sendObjSet("1030");        
        }else{
            sendObj = commonModules.sendObjSet("1031");
        }

        response.status(200).send({
            sendObj
        });

    }catch(error){
        response.status(500).send(error);
    }

});


userRoute.post("/updatePassword", getFields.none(), async (request, response) => {
    let sendObj = {};
    try{
        let date = new Date().toISOString();
        let upRes = await Users.updateOne(
            {email:request.body.email},
            {  
                "password":request.body.password, 
                "loginAttemptsCnt":0,
                "updDate":date,
                "updUser":request.body.email
            }
        )    
        if(upRes.modifiedCount > 0){
            sendObj = commonModules.sendObjSet("1040");
        }else{
            sendObj = commonModules.sendObjSet("1041");
        }

        response.status(200).send({
            sendObj
        });

    }catch(error){
        response.status(500).send(error);
    }
    
});

//accessToken 생성
userRoute.get("/getAccessToken", getFields.none(), async (request, response) => {
    let sendObj = {};
    try {
        // console.log(request.cookies.refreshtoken);
        //쿠키에 있는 토큰 검증
        
        if(request.cookies.refreshtoken){
            // console.log("1");
            const refreshtoken = jwtModules.checkRefreshToken(request.cookies.refreshtoken);
            if(refreshtoken){
                let userData = await Users.findOne({email:refreshtoken.email});
                if(userData){
                    const userObj = {
                        id:userData._id
                        , email:userData.email
                        , blog_seq:userData.blog_seq
                    }
                    sendObj = commonModules.sendObjSet("2000", userObj);
                    const accesstoken = jwtModules.retAccessToken(userData._id, userData.email);
                    response.setHeader("accesstoken", accesstoken);
                }else{
                    sendObj = commonModules.sendObjSet("2001", userObj);
                }
                
            }
        }else{
            // console.log("2");
            sendObj = commonModules.sendObjSet("2002", {});
        }

        // console.log(sendObj);
        response.send({sendObj});
    } catch (error) {
        // console.log("토큰검증실패");
        response.status(500).send(error);
    }
});

userRoute.post("/checkaccessToken", getFields.none(), async (request, response) => {
    let sendObj = {};
    try {
        // console.log("checkaccessToken");
        // console.log(request.headers.accesstoken);
        // console.log(request.headers.accesstoken);
        // console.log(request.cookies.refreshtoken);
        // 헤더에 있는 access 토큰 검증
        // console.log(request.headers.accesstoken);
        

        if(request.headers.accesstoken){
            const accessToken = jwtModules.checkAccessToken(request.headers.accesstoken);
            // console.log("accessToken::", accessToken);
            if(accessToken){
                let userData = await Users.findOne({email:accessToken.email});
                if(userData){
                    const userObj = {
                        id:userData._id
                        , email:userData.email
                        , blog_seq:userData.blog_seq
                    }
                    sendObj = commonModules.sendObjSet("2010", userObj);
                    
                }else{
                    sendObj = commonModules.sendObjSet("2011", {});
                }
            }else{
                sendObj = commonModules.sendObjSet("2011", {});
            }

        }
        // console.log("sendObj::", sendObj);
        response.send({sendObj});

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

userRoute.get("/logout", getFields.none(), async (request, response) => {
    
    let sendObj = {};
    try {
        const refreshToken = jwtModules.checkRefreshToken(request.cookies.refreshtoken);
        // console.log(refreshToken);
        // response.send({sendObj});
        if(refreshToken === false){
            sendObj = commonModules.sendObjSet("2021");
        }else{
            response.clearCookie('refreshtoken');
            sendObj = commonModules.sendObjSet("2020");
        }
        
        response.send({sendObj});

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});



module.exports=userRoute