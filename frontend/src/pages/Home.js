import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds } from '../services/api';
import Post from '../components/Post';
import './Feed.css';
import './Home.css';

const Home = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await getFeeds();
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <>
            {isLoggedIn ? <div className="feed-container">
                < h2 className="feed-title" >All Feeds </h2 >
                {
                    posts.map((post) => (
                        <Post key={post._id} post={post} onCommentAdded={fetchPosts} />
                    ))
                }
            </div > :
                <div className="home-container">
                    <div className="home-content">
                        <h1 className="home-title">Welcome to SocialConnect</h1>
                        <p className="home-description">
                            Connect with friends, share your moments, and explore a world of possibilities.
                        </p>
                        <div className="home-buttons">
                            <Link to="/login" className="home-button login-button">Login</Link>
                            <Link to="/signup" className="home-button signup-button">Sign up</Link>
                        </div>
                    </div>
                </div>
            }
        </>


    );
};

export default Home;