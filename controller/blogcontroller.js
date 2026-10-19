const{blogs}=require("../data/data.js");

const getAllBlogs= (req, res) => {
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
        });
    }
};


const getSingleBlog=(req,res)=>{
    try{
        let blogId= req.params.id;
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
}



const CreateBlg=(req, res) => {
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

}



const DeleteBlog=(req, res) => {
    try{
        let blogId= req.params.id;
        let blogIndex=blogs.findIndex(t=>t.id==blogId)
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
}


const UpdateBlog = (req, res) => {
    try {
        let blogId = req.params.id;
        let body = req.body;

        let blogIndex = blogs.findIndex(t => t.id == blogId);

        // Check blog exists
        if (blogIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Blog not found with id ${blogId}`
            });
        }

        // Validate request body
        if (!body.title && !body.description && !body.author) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description or author"
            });
        }

        // Update blog data
        let updatedBlog = {
            ...blogs[blogIndex],
            ...body,
            id: blogs[blogIndex].id
        };

        // Save updated blog
        blogs[blogIndex] = updatedBlog;

        // Send response
        res.status(200).json({
            success: true,
            message: `Blog updated successfully with id ${blogId}`,
            data: updatedBlog
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


module.exports={
    getAllBlogs, 
    getSingleBlog,
     CreateBlg, 
     DeleteBlog, 
     UpdateBlog};