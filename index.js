import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const posts = JSON.parse(fs.readFileSync("./example.json", "utf-8"));

const date = new Date;


console.log(Intl.DateTimeFormat('es-Es',{dateStyle: "full"}).format(date))

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render("home.ejs",{posts: posts})
})

app.get("/about",(req,res)=>{
    res.render("about.ejs")
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})


app.get("/x",(req,res)=>{
    res.render("viewPost.ejs")
})

app.get("/newpost",(req,res)=>{
    res.render("newpost.ejs")
})

app.get("/viewpost/:slug",(req,res)=>{
    const slug = req.params.slug;

    const post = posts.find(post=>post.slug === slug);

    if (post == undefined) {     //Si no cuentuetra coincidencia, que arroje un error 404
        return res.status(404).json({ message: "Item no encontrado" });
    }

    res.render("viewPost.ejs",{post: post, posts: posts})
})



app.get("/editpost/:slug",(req,res)=>{
    const slug = req.params.slug;

    const post = posts.find(post=>post.slug === slug);

    if (post == undefined) {     //Si no cuentuetra coincidencia, que arroje un error 404
        return res.status(404).json({ message: "Item no encontrado" });
    }

    res.render("editPost.ejs",{post: post})
})









app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})