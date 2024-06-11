const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
const path = require('path');
const userSchemaImport = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("index");
});

app.post("/create",(req,res)=>{
    let {name,email,password,age} = req.body;
    console.log(password);
    bcrypt.genSalt(10,(err,salt)=>{
        console.log(salt);
        bcrypt.hash(password,salt,async(err,hash)=>{
            console.log(hash);
            let createdUser = await userSchemaImport.create({
                name,
                email,
                password:hash,
                age
        })

       
        res.send(createdUser);

        })
    })
});


app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{
    let user = await userSchemaImport.findOne({email:req.body.email});
    if(!user) return res.send("Something Went Wrong");
    console.log(user.password , req.body.password);

    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result)
        {
            let token = jwt.sign({email: user.email},"secretkey");
            //adding cookie using this
            res.cookie("token",token);
            res.send("Yes you can login");
        }else{
            res.send("no you cannot login");
        }
    })

});

//Agar server pr koi change nahi hoga tb get route
//post route means you changing something on server


app.get("/logout",(req,res)=>{
    //remove cookie using this
    res.cookie("token","");
    res.redirect("/");

})
app.listen(3000,(error)=>{
    console.log(error);
});