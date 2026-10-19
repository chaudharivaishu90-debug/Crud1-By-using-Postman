const express=require(`express`);
const router=express.Router();
const blogcontroller=require("../controller/blogcontroller.js")
router.get("/", blogcontroller.getAllBlogs);
router.get("/:id", blogcontroller.getSingleBlog);
router.post("/",blogcontroller.CreateBlg);
router.delete("/:id",blogcontroller.DeleteBlog);
router.patch("/:id",blogcontroller.UpdateBlog);
module.exports=router;