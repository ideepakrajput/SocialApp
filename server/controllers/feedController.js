import User from '../models/User.js';
import Post from '../models/Post.js';

const getUserFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('friendList');

        const friendsPosts = await Post.find({ userId: { $in: user.friendList } })
            .sort({ createdAt: -1 });

        const postsWithFriendsComments = await Post.find({
            'comments.userId': { $in: user.friendList },
            userId: { $nin: user.friendList }
        }).sort({ createdAt: -1 });

        const allPosts = [...friendsPosts, ...postsWithFriendsComments]
            .sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { getUserFeed };