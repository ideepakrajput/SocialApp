import React from 'react';
import { acceptFriendRequest, rejectFriendRequest } from '../services/api';
import './FriendRequest.css';

const FriendRequest = ({ request, onRequestHandled }) => {
    const handleAccept = async () => {
        try {
            await acceptFriendRequest(request.userId);
            onRequestHandled();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleReject = async () => {
        try {
            await rejectFriendRequest(request.userId);
            onRequestHandled();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div className="friend-request">
            <div className="friend-request-avatar">
                {request.userId.username[0].toUpperCase()}
            </div>
            <div className="friend-request-content">
                <p className="friend-request-text">
                    <span className="username">{request.userId.username}</span> sent you a friend request
                </p>
                <div className="friend-request-actions">
                    <button className="btn btn-accept" onClick={handleAccept}>Accept</button>
                    <button className="btn btn-reject" onClick={handleReject}>Reject</button>
                </div>
            </div>
        </div>
    );
};

export default FriendRequest;