import React, { useState, useEffect } from 'react';
import { createPost, getUserPosts, deletePost, updatePost } from '../services/api';
import Post from '../components/Post';
import './Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleUpdatePost = async (postId) => {
        try {
            await updatePost(postId, { content: editContent });
            setEditingPost(null);
            setEditContent('');
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await getUserPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await createPost(newPost);
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="feed-container">
            <h2 className="feed-title">My Feeds</h2>
            <form className="post-form" onSubmit={handleCreatePost}>
                <textarea
                    className="post-textarea"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                />
                <button className="submit-button" type="submit">Post</button>
            </form>
            {posts.map((post) => (
                <Post
                    feed="true"
                    key={post._id}
                    post={post}
                    onCommentAdded={fetchPosts}
                    onDelete={handleDeletePost}
                    onEdit={(postId) => {
                        setEditingPost(postId);
                        setEditContent(post.content);
                    }}
                    isEditing={editingPost === post._id}
                    setIsEditing={(isEditing) => {
                        if (!isEditing) setEditingPost(null);
                    }}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    onUpdate={handleUpdatePost}
                />
            ))}
        </div>
    );
};

export default Feed;