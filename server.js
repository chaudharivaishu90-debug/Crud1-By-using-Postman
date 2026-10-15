const cl=console.log;
const PORT=3000;
const express= require(`express`);
let blogs=[{id:1, title:"My First Blog", description:"This is my first blog post", author:"John Doe"},
    {id:2, title:"My Second Blog", description:"This is my second blog post", author:"Jane Doe"}
];
const app = express();
app.use(express.json());



//GET ALL:: BASE_URL/api/blogs & GET
app.get(`/api/blogs`, (req, res) => {
    try{
        res.status(200).json({
            success:true,
            data:blogs
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message
        })
    }

})







//get single post
app.get("/api/blogs/:id",(req,res)=>{
    try{
        let blogId= parseInt(req.params.id);
        let blog=blogs.find(t=>t.id===blogId);
        if(!blog){
            return res.status(404).json({
                success:false,
                message:`Blogs not found with id ${blogId}`
            });
        }
        res.status(200).json({
            success:true,
            body:blog,
            message:`Blogs Data Fetched with id ${blogId}`
            

        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:`something wrong`,
            error:err.message,
            
        });

    }
});



//Craete
app.post("/api/blogs", (req, res) => {
    try{
        let {title, description, author}=req.body;
    if(!title || !description || !author){
        return res.status(400).json({
            success:false,
            message:"Please provide title, description and author"
            
        })
    }
    let newBlog={
        ...req.body,
        id:String(Date.now())
    }
    blogs.push(newBlog);
    res.status(201).json({
        success:true,
        data:newBlog
    });
        
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message
        });
    }

})


// Delete
app.delete("/api/blogs/:id", (req, res) => {
    try{
        let blogId= parseInt(req.params.id);
        let blogIndex=blogs.findIndex(t=>t.id===blogId)
        if(blogIndex===-1){
            return res.status(404).json({
                success:false,
                message:`Blogs not found with id ${blogId}`
            });
        }
        blogs.splice(blogIndex, 1);
        res.status(200).json({
            success:true,
            message:`Blogs deleted successfully with id ${blogId}`
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message
        });
    }
});

//update
app.put("/api/blogs/:id", (req, res) => {
    try{
        let blogId= parseInt(req.params.id);
        let blogIndex=blogs.findIndex(t=>t.id===blogId)
        if(blogIndex===-1){
            return res.status(404).json({
                success:false,
                message:`Blogs not found with id ${blogId}`
            });
        }
        let updatedBlog={
            ...blogs[blogIndex],
            ...req.body
        };
        blogs[blogIndex] = updatedBlog;
        res.status(200).json({
            success:true,
            data:updatedBlog
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message
        });
    }
});


app.listen(PORT, () => {
    cl(`Server is running on port ${PORT}`);
})
