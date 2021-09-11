const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path=require('path');
const cors=require('cors');
const bodyparser=require('body-parser');
app.use(cors());
const {MONGOURL}=require('./config/prod');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
//I have removed it for safety
  }
});

app.use(bodyparser.json());
const PORT=process.env.PORT || 8000;
mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
  });
  mongoose.set('debug', true);
const db = mongoose.connection;
const userschema=new mongoose.Schema({
    Name:String,
    PhoneNumber:Number,
    Email:String,
    Hobbies:String
})

const user= mongoose.model("usercollections",userschema);


app.post("/update",async (req,res)=>{
    console.log(req.body);
    user.findOneAndUpdate({_id:req.body._id},{$set:{Name:req.body.Name,PhoneNumber:req.body.PhoneNumber,Hobbies:req.body.Hobbies}},{new: true, useFindAndModify: false},(error,data)=>{
        if(error){
          console.log("we could  not update your dATA");
          res.json({message:"Some network error"});
        }
        else{
          console.log(data);
          res.json({message:"data updated"});
        }
  });
})
app.post("/fetchOne",async (req,res)=>{
    console.log(req.body._id);
    user.findOne({_id:req.body._id},{_id:1,Name:1,PhoneNumber:1,Email:1,Hobbies:1},(err,docs)=>{
        if(err){
          console.log(err);
        }
        else{
  
          res.json({message:"success",datas:docs});
        }
      }).limit(1);
})
app.post("/insert",async (req,res)=>{
    
    console.log(req.body);
 
     const user1=new user({
        Name:req.body.Name,
        PhoneNumber:req.body.PhoneNumber,
        Email:req.body.Email,
        Hobbies:req.body.Hobbies
    })
    user.exists({Email:req.body.Email},function (err, doc) { 
        if (err){ 
          
            console.log(err) 
        }else{ 
            if(doc==true){
             
                user.findOne({Email:req.body.Email},(err,docs)=>{
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log(docs);
               
                    res.json({data:"exists",dataId:docs._id});
                  }
                })
    
                
               
            }
            else{
             
              user1.save(function (err,user){
                if (err) return console.error(err);
                else{
                  res.json({data:"done",dataId:user1._id});
          
                }    
              });
            }
    
        } 
    
    }); 

})
app.post("/sendMail",(req,res)=>{
    
      let fulldocs={};
      console.log(req.body);
      console.log(req.body.value);
      user.find({_id: { $in:req.body.value}
    }, function(err, docs){
        console.log(docs);
        
        //  var texts=JSON.stringify(docs)
         
         var texts='<ul>'+
         docs.map(function (user) {
            return '<li><b>' + user.Name + '</b><br></br><b>'+user.PhoneNumber+'</b></li>';
        })+'</ul>';
         var mailOptions = {
             from: 'deepwebwork123@gmail.com',
             to: 'info@redpositive.in',
             subject: 'Sending selected data',
             html:texts
           };
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
               res.json({status:0})
             } else {
               console.log('Email sent: ' + info.response);
               res.json({status:1});
             }
           });
    });
   
})
app.post("/delete",async (req,res)=>{
  
    console.log(req.body);
    user.findByIdAndRemove(req.body._id, (err, user) => {
        
        if (err) {
            console.log(err);
        }
       
        const response = {
            message: "successfully deleted",
            id: user._id
        };
        res.json(response);
    });
})

app.get("/fetch",async (req,res)=>{
    const users= await user.find({},{_id:1,Name:1,PhoneNumber:1,Email:1,Hobbies:1});
  const userMap = {};
  users.forEach((user) => {
      userMap[user._id] = user;
  });
  res.send(userMap);
})
if(process.env.NODE_ENV==="production"){
  app.use(express.static('client/build'));
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,'client','build','index.html'));
})
}
app.listen(PORT,()=>{console.log("server running on port"+PORT)});