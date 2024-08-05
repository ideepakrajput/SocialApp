import React, { useState, useEffect } from 'react';
import { getAllUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/api';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSendFriendRequest = async (receiverId) => {
        try {
            await sendFriendRequest(receiverId);
            alert('Friend request sent successfully!');
            // Optionally, update the user's status in the state
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptFriendRequest = async (requesterId) => {
        try {
            await acceptFriendRequest(requesterId);
            alert('Friend request accepted!');
            // Optionally, update the user's status in the state
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (requesterId) => {
        try {
            await rejectFriendRequest(requesterId);
            alert('Friend request rejected!');
            // Optionally, update the user's status in the state
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div className="users-container">
            <h2 className="users-title">All Users</h2>
            <div className="users-grid">
                {users.map(user => (
                    <div key={user._id} className="user-card">
                        <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                        <h3 className="user-username">{user.username}</h3>
                        <div className="user-actions">
                            {user.status === 'none' &&
                                <button className="btn btn-primary" onClick={() => handleSendFriendRequest(user._id)}>
                                    Send Friend Request
                                </button>
                            }
                            {user.status === 'received' && (
                                <>
                                    <button className="btn btn-success" onClick={() => handleAcceptFriendRequest(user._id)}>
                                        Accept
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleRejectFriendRequest(user._id)}>
                                        Reject
                                    </button>
                                </>
                            )}
                            {user.status === 'sent' && <p className="status-text">Friend Request Sent</p>}
                            {user.status === 'friend' && <p className="status-text friend">Friend</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;