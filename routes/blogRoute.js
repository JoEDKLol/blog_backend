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
const BlogComments = require("../models/blogCommentSchemas");
const ObjectId = require("mongoose").Types.ObjectId;
const commonModules = require("../utils/common");
const { default: mongoose } = require('mongoose');
const db = mongoose.connection;

const sequence = require("../utils/sequences");
const { uploadMiddleware } = require('../utils/imgUpload');
const BlogListLikes = require('../models/blogListLikeSchemas');

// blogRoute.get("/test", getFields.none(), async (request, response) => {
//     try {

//         let bloglist = await BlogLists.find({});
        
//         response.send({
//             result:{
//                 bloglist
//             }

//         });

//     } catch (error) {
//         response.status(500).send(error);
//     }
// });



blogRoute.get("/blogInfo", getFields.none(), async (request, response) => {
    try {
        
        let sendObj = {};
        let BlogInfo = await BlogInfos.findOne({blog_seq:request.params.blog_seq});

        

        let MajorCategory = await MajorCategories.find({blog_id:BlogInfo._id});

        // console.log(MajorCategory);

        let SubCategory = await SubCategories.find({blog_id:BlogInfo._id});
        
        if(!BlogInfo){
            sendObj = commonModules.sendObjSet("2111");
        }else{
            const obj = {
                blogInfo : BlogInfo,
                majorCategory : MajorCategory,
                majorCategoryCnt : MajorCategory.length,
                subCategory : SubCategory,
                subCategoryCnt : SubCategory.length
            }
            sendObj = commonModules.sendObjSet("2110", obj);
        }
        response.send({
            sendObj
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
        const keyword = request.query.keyword;

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
        const searchRgx = rgx(keyword);

        let findCondition = {
            $and: [
                {deleteyn:'n'},
            ]

        };
        
        if(keyword != null && keyword != undefined && keyword != ""){
            findCondition.$or=[
                {title:{$regex:searchRgx}},
                {content:{$regex:searchRgx}},
            ]
        }

        let bloglist = await BlogLists.find(
            findCondition
        )
        .sort({regdate:-1})
        .lean()
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
        console.log(error);
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

        
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
        const searchRgx = rgx(keyword);

        let findCondition = {
            $and: [
                {blog_seq:blogSeq},
                {deleteyn:'n'},
            ]

        };
        if(request.query.majorSeq > 0){
            findCondition.$and.push({
                m_category_seq:request.query.majorSeq
            })
        }

        if(request.query.subSeq > 0){
            findCondition.$and.push({
                s_category_seq:request.query.subSeq
            });
        }
        
        if(keyword != null && keyword != undefined && keyword != ""){
            findCondition.$or=[
                {title:{$regex:searchRgx}},
                {content:{$regex:searchRgx}},
            ]
        }

        let bloglist = await BlogLists.find(
            findCondition
        )
        .sort({regdate:-1})
        .lean()
        .skip(skipPage)
        .limit(pageListCnt);

        // console.log(bloglist);

        if(!bloglist){
            sendObj = commonModules.sendObjSet("2121");
        }else{
            let addObj = {
                currentPage:currentPage,
                list:bloglist
            }
            sendObj = commonModules.sendObjSet("2120", addObj);
        }
        response.send({
            sendObj
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

blogRoute.post("/fileUpload", async (request, response) => {
    try {
        let sendObj = {};
        uploadMiddleware(request, response, async function (err) {
            if (err instanceof multer.MulterError) {  
                // console.log(err.code);
                sendObj = commonModules.sendObjSet("2131");
            } else if (err) {      // An unknown error occurred when uploading. 
                // console.log(err.code);
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
                    blog_seq:request.body.blog_seq,
                    reguser:request.body.email,
                    upduser:request.body.email
                }

                // console.log(blogTempImgObj);
    
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
                    // console.log(error);
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
            m_category_seq:request.body.m_category_seq,
            s_category_seq:request.body.s_category_seq,
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
        // console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.get("/blogDetail", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        // console.log(request.query);
        const blogSeq = Number(request.query.blog_seq);
        const seq = Number(request.query.seq);

        let blogDetail = await BlogLists.findOne({
            blog_seq:blogSeq,
            seq:seq,
            deleteyn:'n'
            
        })

        let majorCaName;
        let subCaName;
        if(blogDetail){
            majorCaName = await MajorCategories.findOne({
                seq:blogDetail.m_category_seq,
                deleteyn:'n'
            })
            subCaName = await SubCategories.findOne({
                seq:blogDetail.s_category_seq,
                deleteyn:'n'
                
            })
        }
 
        if(!blogDetail){
            sendObj = commonModules.sendObjSet("2151");
        }else{

            let addObj = {
                blogDetail:blogDetail,
                majorCaName:(majorCaName)?majorCaName.categoryNm:"",
                subCaName:(subCaName)?subCaName.categoryNm:""
            }

            sendObj = commonModules.sendObjSet("2150", addObj);
        }
        response.send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});


blogRoute.post("/update", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        // console.log(request.body);

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

        // console.log(tempImgList);

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

        
        let date = new Date().toISOString();
        let updateBlogLists = await BlogLists.updateOne(
            {
                user_id:new ObjectId(request.body.user_id),
                blog_seq:request.body.blog_seq,
                seq:request.body.seq
            },{
                "m_category_seq":request.body.m_category_seq,
                "s_category_seq":request.body.s_category_seq,
                "title":request.body.title,
                "pic":firstImg,
                "content":request.body.content,
                "public":"",
                "hashtag":"",
                "temp_num":_temp_num,
                "upduser":request.body.email,
                "updDate":date,
            }
        );



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

blogRoute.post("/blogUpdate", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        let date = new Date().toISOString();
        
        if(request.body.imgDelete){ //uploads img delete

        }
        
        let updateBlogLists = await BlogInfos.updateOne(
            {
                email:request.body.email,
                seq:request.body.blog_seq,
            },{
                "name":request.body.name,
                "blogtitle":request.body.blogtitle,
                "introduction":request.body.introduction,
                "blogimg_thumbnailimg":request.body.blogimg_thumbnailimg,
                "blogimg":request.body.blogimg,
                "upduser":request.body.email,
                "updDate":date,
            }
        );

        // console.log(updateBlogLists);
        sendObj = commonModules.sendObjSet("2170");
        //2140
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/majorAdd", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        let date = new Date().toISOString();
        
        // console.log(request.body);

        let searchMajor = await MajorCategories.findOne(
            {seq:request.body.seq}
        );

        // console.log(searchMajor);
        if(searchMajor){ //update
            // console.log(searchMajor);
            let updatetMajor = await MajorCategories.findOneAndUpdate(
                {seq:request.body.seq},
                {
                    "categoryNm":request.body.categoryNm,
                    "upduser":request.body.email,
                    "updDate":date,
                },
                { new: true}
            )

            sendObj = commonModules.sendObjSet("2180", updatetMajor);

        }else{ //insert
            const maJorSeq = await sequence.getSequence("major_category_seq")
            const blogMajorObj = {
                seq:maJorSeq,
                blog_id:request.body.blog_id,
                categoryNm:request.body.categoryNm,
                reguser:request.body.email,
                upduser:request.body.email
            }

            const newMajorCategories =new MajorCategories(blogMajorObj);
            const resMajorCategories = await newMajorCategories.save();
            sendObj = commonModules.sendObjSet("2180", resMajorCategories);
        }

        
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/majorDelete", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        const session = await db.startSession();
        session.startTransaction();
        
        const majorDeleteRes = await MajorCategories.deleteOne({
            seq:request.body.seq
        });

        const subDeleteRes = await SubCategories.deleteMany({
            m_category_seq:request.body.seq
        });

        await session.commitTransaction();
        session.endSession();

        sendObj = commonModules.sendObjSet("2190");
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/subAdd", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        let date = new Date().toISOString();
        let searchSub = await SubCategories.findOne(
            {seq:request.body.seq}
        );

        if(searchSub){ //update
            let updatetSub = await SubCategories.findOneAndUpdate(
                {seq:request.body.seq},
                {
                    "categoryNm":request.body.categoryNm,
                    "upduser":request.body.email,
                    "updDate":date,
                },
                { new: true}
            )

            sendObj = commonModules.sendObjSet("2200", updatetSub);

        }else{ //insert
            const subSeq = await sequence.getSequence("sub_category_seq")
            const blogSubObj = {
                seq:subSeq,
                m_category_seq:request.body.m_category_seq,
                blog_id:request.body.blog_id,
                categoryNm:request.body.categoryNm,
                reguser:request.body.email,
                upduser:request.body.email
            }

            const newSubCategories = new SubCategories(blogSubObj);
            const resSubCategories = await newSubCategories.save();

            sendObj = commonModules.sendObjSet("2200", resSubCategories);
        }

        
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});
 

blogRoute.post("/subDelete", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        const subDeleteRes = await SubCategories.deleteMany({
            seq:request.body.seq
        });

        sendObj = commonModules.sendObjSet("2210");
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/bloglistdelete", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};
        
        let date = new Date().toISOString();
        
        let deleteBlogLists = await BlogLists.updateOne(
            {
                blog_seq:request.body.blog_seq,
                seq:request.body.seq,
            },{
                "deleteyn":"y",
                "upduser":request.body.email,
                "updDate":date,
            }
        );

        sendObj = commonModules.sendObjSet("2220");
        //2140
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/commentwrite", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        //startTransaction
        const session = await db.startSession();
        session.startTransaction();

        const blog_comment_seq = await sequence.getSequence("blog_comment_seq");
        // console.log(request.query.user_id);
        const blogCommentObj = {
            
            bloginfo:new ObjectId(request.body.blog_id),
            blog_seq : request.body.blog_seq,
            blog_list_seq : request.body.blog_list_seq,
            seq:blog_comment_seq, 
            email : request.body.email,
            comment:request.body.comment,
            reguser:request.body.email,
            upduser:request.body.email
        }

        const newBlogComments = new BlogComments(blogCommentObj);
        const resBlogComments = await newBlogComments.save();

        let blogComments = await BlogComments.findOne({
            _id:resBlogComments._id
        })
        .populate('bloginfo').exec();

         const BlogList = await BlogLists.updateOne({
                seq:request.body.blog_list_seq,
                deleteyn:'n'
            },
            { $inc: { "commentscnt": 1 } }
         )

         // 4. commit
         await session.commitTransaction();
         // 5. endSession
         session.endSession();

        // console.log(updateBlogLists);
        sendObj = commonModules.sendObjSet("2230", blogComments);
        //2140
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.get("/comments", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        const currentPage = request.query.currentPage;
        const pageListCnt = commonModules.commentPage
        const skipPage = pageListCnt*(currentPage-1);
        const blogSeq = Number(request.query.blog_seq);
        const blog_list_seq = Number(request.query.blog_list_seq);

        let blogComments = await BlogComments.find({
            blog_seq:blogSeq,
            blog_list_seq:blog_list_seq,
            deleteyn:'n'
        })
        .sort({regdate:-1})
        .lean()
        .skip(skipPage)
        .limit(pageListCnt).populate('bloginfo').exec();

        
        sendObj = commonModules.sendObjSet("2240", blogComments);
        response.send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/commentdelete", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        const comment_id = request.body.comment_id;
        const user_email = request.body.user_email;
        let date = new Date().toISOString();

        //startTransaction
        const session = await db.startSession();
        session.startTransaction();

        let deleteBlogComment = await BlogComments.updateOne(
            {
                _id:comment_id,
                email:user_email,
            },{
                "deleteyn":"y",
                "upduser":request.body.email,
                "updDate":date,
            }
        );        

        const BlogList = await BlogLists.updateOne({
                seq:request.body.blog_list_seq,
                deleteyn:'n'
            },
            { $inc: { "commentscnt": -1 } }
        )
        // 4. commit
        await session.commitTransaction();
        // 5. endSession
        session.endSession();

        sendObj = commonModules.sendObjSet("2250");
        response.send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.get("/commentsseq", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        const currentSeq = Number(request.query.currentSeq);
        const searchListCnt = commonModules.commentPage;
        const blogSeq = Number(request.query.blog_seq);
        const blog_list_seq = Number(request.query.blog_list_seq);

        const queryStr = {
                blog_seq:blogSeq,
                blog_list_seq:blog_list_seq,
                deleteyn:'n',
                // seq:{"$gt":currentSeq}
        }
        
        if(currentSeq > 0){
            queryStr.seq = {"$lt":currentSeq}
        }

        let blogComments = await BlogComments.find(
            queryStr
        )
        .sort({regdate:-1})
        .lean()
        .limit(searchListCnt).populate('bloginfo').exec();

        const resObj = {
            blogComments : blogComments,
        }

        if(blogComments.length > 0){
            resObj.lastCommentSeq = blogComments[blogComments.length-1].seq
        }

        sendObj = commonModules.sendObjSet("2240", resObj);
        response.send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.post("/bloglistlikeupdate", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        let BlogListLike = await BlogListLikes.findOne({
            user_id:request.body.user_id,
            blog_list_seq:Number(request.body.blog_list_seq),
            deleteyn:'n'
        })

        //startTransaction
        const session = await db.startSession();
        session.startTransaction();
        

        if(!BlogListLike){

            const blog_list_seq = Number(request.body.blog_list_seq);

            let BlogList = await BlogLists.findOne({
                seq:blog_list_seq,
                deleteyn:'n'
            })

            const blogListLikeObj = {
                user_id : new ObjectId(request.body.user_id),
                blog_list_seq : request.body.blog_list_seq,
                like_yn : request.body.like_yn,
                blogListInfo : BlogList._id,
                reguser:request.body.email,
                upduser:request.body.email
            }
    
            const newBlogListLikes = new BlogListLikes(blogListLikeObj);
            const resBlogListLikes = await newBlogListLikes.save();

            const resObj = {
                like_yn : request.body.like_yn
            }

            sendObj = commonModules.sendObjSet("2260", resObj);
        }else{
            const BlogListLike = await BlogListLikes.updateOne({
                user_id:request.body.user_id,
                blog_list_seq:Number(request.body.blog_list_seq),
                deleteyn:'n' 
            },
            {
                like_yn : request.body.like_yn,
            }
            )

            const resObj = {
                like_yn : request.body.like_yn
            }
            sendObj = commonModules.sendObjSet("2260", resObj);
        }

        
        let blogUpdateObj = {}
        if(request.body.like_yn === 'y'){
            blogUpdateObj = { $inc: { "likecnt": 1 } }
        }else{
            blogUpdateObj = { $inc: { "likecnt": -1 } }
        }

        const BlogList = await BlogLists.updateOne({
            seq:request.body.blog_list_seq,
            deleteyn:'n'
        },
            blogUpdateObj
        )

        // 4. commit
        await session.commitTransaction();
        // 5. endSession
        session.endSession();

        
        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

blogRoute.get("/searchbloglistlike", getFields.none(), async (request, response) => {
    try {
        let sendObj = {};

        let BlogListLike = await BlogListLikes.findOne({
            user_id:request.query.user_id,
            blog_list_seq:Number(request.query.blog_list_seq),
            deleteyn:'n'
        })

        if(!BlogListLike){

            const resObj = {
                like_yn : "n"
            }
            sendObj = commonModules.sendObjSet("2270", resObj);

        }else{
            const resObj = {
                like_yn : BlogListLike.like_yn
            }

            sendObj = commonModules.sendObjSet("2270", resObj);
        }

        response.status(200).send({
            sendObj
        });

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

module.exports=blogRoute