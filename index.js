import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import methodOverride from "method-override"

const app = express();
const port = 3000;

class Post {
    constructor(currentPost = { title: "", content: "", author: "", authorInfo: "" }, id = 0) {
        this.id = Number(id);
        this.title = currentPost.title;
        this.content = currentPost.content;
        this.author = currentPost.author;
        this.authorInfo = currentPost.authorInfo;
        this.slug = currentPost.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
        this.postDate = new Date;
    }

}

const posts = JSON.parse(fs.readFileSync("./posts.json", "utf-8"));


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(methodOverride('_method'));



app.get("/", (req, res) => {
    res.render("home.ejs", { posts: posts })
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs")
})


app.get("/newpost", (req, res) => {
    const obj = new Post()
    res.render("newPost.ejs", { post: obj, alert: false })
})

app.get("/viewpost/:slug", (req, res) => {
    const slug = req.params.slug;

    const post = posts.find(post => post.slug === slug);

    if (post == undefined) {     //Si no cuentuetra coincidencia, que arroje un error 404
        return res.status(404).json({ message: "Item no encontrado" });
    }

    res.render("viewPost.ejs", { post: post, posts: posts , alert: req.query.redirect === "true"})
})



app.get("/editpost/:slug", (req, res) => {
    const slug = req.params.slug;

    const post = posts.find(post => post.slug === slug);

    if (post == undefined) {     //Si no cuentuetra coincidencia, que arroje un error 404
        return res.status(404).json({ message: "Item no encontrado" });
    }

    res.render("editPost.ejs", { post: post, alert: false })
})




app.post("/submit", (req, res) => {

    const currentPost = new Post(req.body, posts.length);

    const test = posts.findIndex(post => post.slug == currentPost.slug);
    if (test !== -1) {

        res.render("newPost.ejs", { post: currentPost, alert: true })

    } else {

        posts.push(currentPost)
        fs.writeFileSync("./posts.json", JSON.stringify(posts))
        res.redirect(`/viewpost/${currentPost.slug}?redirect=true`);
        //Se debe agregar alerta de exito.
    }

})




app.put("/edit/:id", (req, res) => {

    const id = req.params.id;
    const currentPost = new Post(req.body, id);


    if (posts[id].slug == currentPost.slug || !posts.some(post => post.slug == currentPost.slug)) {

        posts[id] = (currentPost)
        fs.writeFileSync("./posts.json", JSON.stringify(posts))
        res.redirect(`/viewpost/${currentPost.slug}?redirect=true`);
        //Se debe agregar alerta de exito.
    } else {

        res.render("editPost.ejs", { post: currentPost, alert: true })

    }

})







app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})