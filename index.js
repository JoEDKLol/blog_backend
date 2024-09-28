const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
dotenv.config()

const cors = require("cors")
let corspolicy = {
    // origin:'http://localhost:3000'
    origin:process.env.FRONTEND_URL
}

const userRouter = require('./routes/userRoute')

const app = express()

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(
    cors({
      exposedHeaders: ['accesstoken'],
      // credentials: true,
    }),
  );
app.use(cors(corspolicy));
app.use(cookieParser());
// app.use(cookieParser('1234'));
const db = module.exports = () => {

  try{
      mongoose.connect(process.env.DBURI
      ,   {user:process.env.DBUSERNAME, pass:process.env.DBPASSWORD,
          useNewUrlParser:true, useUnifiedTopology:true
          }
      )
      console.log("MongoDB Connection is Successful")
  }catch(error){
      console.log("MongoDB Connection is failed")
  }
}

db();

app.use('/',userRouter)



app.listen(process.env.PORT,()=>{
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})