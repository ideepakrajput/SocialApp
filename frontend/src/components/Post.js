import React, { useState } from 'react';
import { addComment } from '../services/api';
import Comment from './Comment';
import './Post.css';

const Post = ({ feed, post, onCommentAdded, onDelete, onEdit, isEditing, setIsEditing, editContent, setEditContent, onUpdate }) => {
    const [comment, setComment] = useState('');

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await addComment(post._id, comment);
            setComment('');
            onCommentAdded();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="post">
            <h3 className="post-username">{post.userId.username}</h3>
            {isEditing ? (
                <div>
                    <textarea
                        className="post-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button className="save-button" onClick={() => onUpdate(post._id)}>Save</button>
                    <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p className="post-content">{post.content}</p>
                    {feed === "true" && (
                        <div className="post-actions">
                            <button className="edit-button" onClick={() => onEdit(post._id)}>Edit</button>
                            <button className="delete-button" onClick={() => onDelete(post._id)}>Delete</button>
                        </div>
                    )}
                </div>
            )}
            {feed !== "true" && (
                <>
                    <div className="comments-section">
                        {post.comments.map((comment) => (
                            <Comment key={comment._id} comment={comment} />
                        ))}
                    </div>
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input
                            className="comment-input"
                            type="text"
                            value={comment}
                            required
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button className="comment-submit" type="submit">Add Comment</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Post;