const express = require("express");
const mongoose= require("mongoose");
const app= express();
const cors=require("cors");

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/newContact",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
  },()=>{        
    console.log("DB connected");
})
 //schema
const userSchema= new mongoose.Schema({ 
    firstName:String,
    lastName:String,
    email:String,
    phone:Number,
})

 const User= new mongoose.model("User",userSchema)

// //Routes

app.post("/v1/contacts",async (req,res)=>{
     const data =new User({
        firstName:req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
     })
     const val=await data.save();
     res.json(val)
})

app.get("/v1/contacts/",async(req,res)=>{
    User.find((err,data)=>{
        if(err){
             res.status(500).send(err)
        }else{
         res.status(200).send(data)  
        }
     })
})

app.get("/v1/contacts/:id",async(req,res)=>{
     fetchid=req.params.id
     User.find(({id:fetchid}),function(err,val){
        if(err){
            res.send("error")
        }else{
            if(val.length==0){
                res.send("data does not exist")
            }else{
                res.send (val)
            }
        }
       
     })
})

app.delete("/v1/contacts/:id",async(req,res)=>{
    fetchid=req.params.id
    User.findOneAndDelete(({id:fetchid}),function(err,docs){
      if(docs===null){
        res.send("wrond id")
      }else{
        res.send("Deleted succefully")
      }
      
    })
})

app.put("/v1/contacts/:id", async (req,res)=>{
    let fetchid=req.params.id
    let upname=req.body.firstName
    let uplastName=req.body.lastName
    let upemail=req.body.email
    let upphone=req.body.phone
    User.findOneAndUpdate({id:fetchid},{$set:{firstName:upname,lastName:uplastName,email:upemail,phone:upphone}},
        {new:true},(err,data)=>{
            if(err){
                res.send("error")
            }else{
                if(data==null){
                    res.send("nothing found")
                }else{
                    res.send(data)
                }
            }


    })
})


  
app.listen(3002,()=>{
    console.log("BE STARTED at port 3002");  
    
})   


 
