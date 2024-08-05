import Post from '../models/Post.js';

/**
 * Creates a new post in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the post content.
 * @param {string} req.body.content - The content of the new post.
 * @param {string} req.user.id - The ID of the user creating the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - The newly created post.
 */
const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;

        const newPost = new Post({
            userId,
            content
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Adds a new comment to an existing post.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the comment content.
 * @param {string} req.body.content - The content of the new comment.
 * @param {string} req.params.postId - The ID of the post to add the comment to.
 * @param {string} req.user.id - The ID of the user creating the comment.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - The updated post with the new comment.
 */
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({
            userId,
            content,
            createdAt: new Date()
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieves a post by its ID and populates the userId field with the username and fullName.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.postId - The ID of the post to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - The retrieved post.
 */
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('userId', 'username fullName');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieves all posts for the authenticated user and populates the userId field with the username and fullName.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - The retrieved posts.
 */
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Updates the content of a post.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.content - The new content for the post.
 * @param {string} req.params.postId - The ID of the post to update.
 * @param {string} req.user.id - The ID of the user updating the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - The updated post.
 */
const updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findOne({ _id: req.params.postId,userId: req.user.id });
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found or you are not authorized to update this post' });
        }

        post.content = content;
        
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Deletes a post by its ID if the authenticated user is the owner of the post.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.postId - The ID of the post to delete.
 * @param {string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A success message if the post was deleted successfully.
 */
const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.postId, userId: req.user.id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found or you are not authorized to delete this post' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { createPost, addComment, getPost, getPosts, updatePost, deletePost };