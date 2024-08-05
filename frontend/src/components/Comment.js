import React from 'react';
import './Comment.css';

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <div className="comment-header">
                <strong className="comment-username">{comment.userId.username}</strong>
            </div>
            <div className="comment-content">{comment.content}</div>
        </div>
    );
};

export default Comment;