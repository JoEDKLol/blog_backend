const express=require('express')
const multer=require('multer')
const blogRoute=express.Router()
const dotenv = require('dotenv')
const fs = require('fs');
let getFields=multer()
const Users = require("../models/userSchemas");
const BlogInfos = require("../models/blogInfoSchemas");
const MajorCategories = require("../models/majorCategorySchemas");
const SubCategories = require("../models/subCategorySchemas");
const BlogLists = require("../models/blogListSchemas");
const BlogTempImgs = require("../models/blogTempImgSchemas");
const ObjectId = require("mongoose").Types.ObjectId;
const commonModules = require("../utils/common");
const { default: mongoose } = require('mongoose');
const db = mongoose.connection;

const sequence = require("../utils/sequences");
const { uploadMiddleware } = require('../utils/imgUpload');

blogRoute.get("/test", getFields.none(), async (request, response) => {
    try {

        let bloglist = await BlogLists.find({});
        
        response.send({
            result:{
                bloglist
            }

        });

    } catch (error) {
        response.status(500).send(error);
    }
});

blogRoute.get("/bloglist", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        const currentPage = request.query.currentPage;
        const pageListCnt = commonModules.mainBoardSPage
        const skipPage = pageListCnt*(currentPage-1);
        const keyword = request.params.keyword;

        let bloglist = await BlogLists.find({
            deleteyn:'n'
        })
        .sort({regdate:-1})
        .skip(skipPage)
        .limit(pageListCnt);
        
        // const updateBlog = await BlogLists.updateMany({deleteyn:'n'});
        if(!bloglist){
            sendObj = commonModules.sendObjSet("2101");
        }else{

            let addObj = {
                currentPage:currentPage,
                list:bloglist
            }

            sendObj = commonModules.sendObjSet("2100", addObj);
        }
        response.send({
            sendObj
        });

    } catch (error) {
        // console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.get("/blogInfo", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        let BlogInfo = await BlogInfos.findOne({blog_seq:request.params.blog_seq});
        
        if(!BlogInfo){
            sendObj = commonModules.sendObjSet("2111");
        }else{
            sendObj = commonModules.sendObjSet("2110", BlogInfo);
        }
        response.send({
            sendObj
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

blogRoute.get("/bloglistEa", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        const currentPage = request.query.currentPage;
        const pageListCnt = commonModules.mainBoardSPage
        const skipPage = pageListCnt*(currentPage-1);
        const keyword = request.query.keyword;
        const blogSeq = Number(request.query.blog_seq);

        let bloglist = await BlogLists.find({
            blog_seq:blogSeq,
            deleteyn:'n'
            
        })
        .sort({regdate:-1})
        .skip(skipPage)
        .limit(pageListCnt);
        
        // const updateBlog = await BlogLists.updateMany({deleteyn:'n'});
        if(!bloglist){
            sendObj = commonModules.sendObjSet("2120");
        }else{

            let addObj = {
                currentPage:currentPage,
                list:bloglist
            }

            sendObj = commonModules.sendObjSet("2121", addObj);
        }
        response.send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

// blogRoute.post("/fileUpload", uploadMiddleware, async (request, response) => {
blogRoute.post("/fileUpload", async (request, response) => {
    try {
        let sendObj = {};
        uploadMiddleware(request, response, async function (err) {

            if (err instanceof multer.MulterError) {  
                // console.log(err.code);
                sendObj = commonModules.sendObjSet("2131");
            } else if (err) {      // An unknown error occurred when uploading. 
                sendObj = commonModules.sendObjSet("2131");
            }    // Everything went fine. 
            else {
                // console.log("user_id", request.file);
                // console.log("user_id", request.body);
                const protocol = request.protocol;
                const host = request.hostname;
                const url = request.originalUrl;
                const port = process.env.PORT;
                const fullUrl = `${protocol}://${host}:${port}/`
                // console.log("user_id", fullUrl);
                // blogTempImgSchemas save
                const blogTempImgObj = {
                    user_id:request.body.user_id,
                    temp_num :request.body.temp_num,
                    img : request.file.filename,
                    img_url:fullUrl+request.file.filename,
                    reguser:request.body.email,
                    upduser:request.body.email
                }
    
                const newBlogTempImgs =new BlogTempImgs(blogTempImgObj);
                const resBlogTempImgs = await newBlogTempImgs.save();
                const resObj = {
                    img_url : fullUrl + request.file.filename
                }

                sendObj = commonModules.sendObjSet("2130", resObj);

            }

            response.send({
                sendObj
            });

        })

    } catch (error) {
        response.status(500).send(error);
    }
});

blogRoute.post("/write", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        console.log(request.body);

        const _temp_num = request.body.randomNum
        const tempImgList = await BlogTempImgs.find({
            user_id:request.body.user_id,
            temp_num:_temp_num,
        }).sort({regdate:1})
        
        //startTransaction
        const session = await db.startSession();
        session.startTransaction();
        
        //img check in content and delete
        let firstImgArr = [];
        for(let i=0; i<tempImgList.length; i++){
            let imgExist = request.body.content.indexOf(tempImgList[i].img);
            
            if(imgExist < 0){ //delete
                await BlogTempImgs.deleteOne({
                    img:tempImgList[i].img
                });
                try {
                    if (fs.existsSync("./uploads/" + tempImgList[i].img)) {
                        fs.unlinkSync("./uploads/" + tempImgList[i].img);
                    }
                } catch (error) {
                    console.log(error);
                }
            }else{
                firstImgArr.push(tempImgList[i].img_url);
            }
        }
 
        let firstImg = "";
        (firstImgArr.length === 0)?firstImg = "":firstImg=firstImgArr[0];

        const blog_list_seq = await sequence.getSequence("blog_list_seq");
        const BlogListObj = {
            
            user_id : request.body.user_id, 
            blog_seq : request.body.blog_seq, 
            seq:blog_list_seq, 
            m_category_id:"",
            s_category_id:"",
            title:request.body.title,
            pic:firstImg,
            temp_num:_temp_num,
            content:request.body.content,
            public:"",
            hashtag:"",
            deleteyn:"n",
            reguser:request.body.email,
            upduser:request.body.email
        }

        // console.log(BlogListObj);
        const newBlogList = new BlogLists(BlogListObj);
        const resBlogTempImgs = await newBlogList.save();

        // 4. commit
        await session.commitTransaction();
        // 5. 세션 끝내기
        session.endSession();
        
        sendObj = commonModules.sendObjSet("2140");
        //2140
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

// blogRoute.get("/sequenceTest", getFields.none(), async (request, response) => {
//     try {
//         let sendObj = {};

//         const test = await sequence.getSequence("blog_seq");
//         sendObj.squence = test;
//         response.send({
//             sendObj
//         });

//     } catch (error) {
//         // console.log(error);
//         response.status(500).send(error);
//     }
// });

module.exports=blogRoute