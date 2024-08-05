import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [updateFields, setUpdateFields] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFields({ ...updateFields, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(updateFields);
            setEditing(false);
            fetchProfile();  // Refresh profile data
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!profile) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{profile.username[0].toUpperCase()}</div>
                    <h2 className="profile-title">{profile.username}'s Profile</h2>
                </div>
                {editing ? (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                defaultValue={profile.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={profile.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info">
                        <p><strong>Full Name:</strong> {profile.fullName}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;