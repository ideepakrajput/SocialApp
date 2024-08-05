import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

/**
 * Handles user signup by creating a new user in the database and generating a JWT token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user signup data.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email address of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.fullName - The full name of the new user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the new user object and a JWT token.
 */
const signup = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const user = new User({ username, email, password, fullName });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles user login by verifying the provided email and password, and generating a JWT token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user login data.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the user object and a JWT token.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Sends a friend request from the current user to the specified user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the friend request data.
 * @param {string} req.body.receiverId - The ID of the user who will receive the friend request.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response indicating the friend request was sent successfully.
 */
const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;

        await User.findByIdAndUpdate(senderId, {
            $push: { pendingFriendRequests: { userId: receiverId, status: 'sent' } }
        });

        await User.findByIdAndUpdate(receiverId, {
            $push: { pendingFriendRequests: { userId: senderId, status: 'received' } }
        });

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Accepts a friend request from the current user to the specified user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the friend request data.
 * @param {string} req.body.requesterId - The ID of the user who sent the friend request.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response indicating the friend request was accepted successfully.
 */
const acceptFriendRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const accepterId = req.user.id;

        await User.findByIdAndUpdate(accepterId, {
            $pull: { pendingFriendRequests: { userId: requesterId } },
            $push: { friendList: requesterId }
        });

        await User.findByIdAndUpdate(requesterId, {
            $pull: { pendingFriendRequests: { userId: accepterId } },
            $push: { friendList: accepterId }
        });

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Rejects a friend request from the current user to the specified user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the friend request data.
 * @param {string} req.body.requesterId - The ID of the user who sent the friend request.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response indicating the friend request was rejected successfully.
 */
const rejectFriendRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const rejecterId = req.user.id;

        await User.findByIdAndUpdate(rejecterId, {
            $pull: { pendingFriendRequests: { userId: requesterId } }
        });

        await User.findByIdAndUpdate(requesterId, {
            $pull: { pendingFriendRequests: { userId: rejecterId } }
        });

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieves the profile of the current user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the user's profile information, excluding the password.
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Updates the profile of the current user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the updated user profile data.
 * @param {string} [req.body.fullName] - The updated full name of the user.
 * @param {string} [req.body.profilePicture] - The updated profile picture of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the updated user profile information.
 */
const updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['fullName', 'profilePicture'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).populate('pendingFriendRequests');
        const users = await User.find({ _id: { $ne: req.user.id } }, 'username fullName');

        const usersWithStatus = users.map(user => {
            const pendingRequest = currentUser.pendingFriendRequests.find(
                request => request.userId.toString() === user._id.toString()
            );
            let status = 'none';
            if (pendingRequest) {
                status = pendingRequest.status;
            } else if (currentUser.friendList.includes(user._id)) {
                status = 'friend';
            }
            return { ...user.toObject(), status };
        });

        res.json(usersWithStatus);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export { signup, login, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getProfile, updateProfile, getAllUsers };