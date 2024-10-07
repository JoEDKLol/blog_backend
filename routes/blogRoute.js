const express=require('express')
const multer=require('multer')
const blogRoute=express.Router()
let getFields=multer()
const Users = require("../models/userSchemas");
const BlogInfos = require("../models/blogInfoSchemas");
const MajorCategories = require("../models/majorCategorySchemas");
const SubCategories = require("../models/subCategorySchemas");
const BlogLists = require("../models/blogListSchemas");
const ObjectId = require("mongoose").Types.ObjectId;
const commonModules = require("../utils/common");
const { default: mongoose } = require('mongoose');
const db = mongoose.connection;

const sequence = require("../utils/sequences");

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