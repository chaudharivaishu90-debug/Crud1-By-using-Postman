const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

// This example keeps its own data, separate from the manual CRUD implementation.
// The data is stored only in memory and resets whenever this process restarts.
const blogs = [
    {
        id: 1,
        title: "My First Blog",
        description: "This is my first blog post",
        author: "John Doe"
    },
    {
        id: 2,
        title: "My Second Blog",
        description: "This is my second blog post",
        author: "Jane Doe"
    }
];

const blogFields = ["title", "description", "author"];

// Check that the request body is an object with valid blog fields.
function validateBlogFields(body, requireAllFields) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return "Request body must be a JSON object.";
    }

    const fieldsToCheck = requireAllFields
        ? blogFields
        : blogFields.filter((field) => Object.hasOwn(body, field));

    if (fieldsToCheck.length === 0) {
        return "Provide at least one of title, description or author.";
    }

    for (const field of fieldsToCheck) {
        if (typeof body[field] !== "string" || body[field].trim() === "") {
            return `${field} must be a non-empty string.`;
        }
    }

    return null;
}

// GET all blogs.
app.get("/api/blogs", (req, res) => {
    res.status(200).json({
        success: true,
        data: blogs
    });
});

// GET one blog. IDs are compared as strings so numeric seed IDs also match URLs.
app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find((item) => String(item.id) === req.params.id);

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: `Blog not found with id ${req.params.id}`
        });
    }

    return res.status(200).json({
        success: true,
        data: blog
    });
});

// POST a blog. New IDs use the timestamp string format from the manual controller.
app.post("/api/blogs", (req, res) => {
    const validationError = validateBlogFields(req.body, true);

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    const newBlog = {
        id: String(Date.now()),
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        author: req.body.author.trim()
    };

    blogs.push(newBlog);

    return res.status(201).json({
        success: true,
        data: newBlog
    });
});

// PUT updates the supplied blog fields while keeping the original ID unchanged.
app.put("/api/blogs/:id", (req, res) => {
    const blog = blogs.find((item) => String(item.id) === req.params.id);

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: `Blog not found with id ${req.params.id}`
        });
    }

    const validationError = validateBlogFields(req.body, false);

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    for (const field of blogFields) {
        if (Object.hasOwn(req.body, field)) {
            blog[field] = req.body[field].trim();
        }
    }

    return res.status(200).json({
        success: true,
        message: `Blog updated successfully with id ${req.params.id}`,
        data: blog
    });
});

// DELETE a blog by ID.
app.delete("/api/blogs/:id", (req, res) => {
    const blogIndex = blogs.findIndex(
        (item) => String(item.id) === req.params.id
    );

    if (blogIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Blog not found with id ${req.params.id}`
        });
    }

    blogs.splice(blogIndex, 1);

    return res.status(200).json({
        success: true,
        message: `Blog deleted successfully with id ${req.params.id}`
    });
});

// Return clear JSON errors for malformed JSON and unexpected server errors.
app.use((err, req, res, next) => {
    if (err.status === 400 || err instanceof SyntaxError) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body."
        });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Starting this file directly runs the separate API on port 3001.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Agent-assisted Blog CRUD API is running at http://localhost:${PORT}`);
    });
}

module.exports = app;
