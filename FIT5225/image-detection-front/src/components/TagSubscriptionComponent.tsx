import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TagSubscriptionComponent: React.FC = () => {
    const [tags, setTags] = useState<string>(''); // Changed from 'tag' to 'tags'
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>(''); // State for email
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [idToken, setIdToken] = useState<string>('');

    // Load credentials from localStorage upon component mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || 'default_username';
        const savedEmail = localStorage.getItem('email') || 'default_email'; // Get email from localStorage
        const savedIdToken = localStorage.getItem('idToken') || '';

        setUsername(savedUsername);
        setEmail(savedEmail); // Set email state
        setIdToken(savedIdToken);
    }, []);

    const handleSubscribe = async () => {
        setLoading(true);
        const apiEndpoint = 'https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/subscribe';
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''); // Splitting tags by comma, trimming, and removing empty entries

        try {
            // POST data now includes an array of tags
            const postData = {
                username,
                email,
                tags: tagArray // Sending tags as an array
            };

            const response = await axios.post(apiEndpoint, JSON.stringify(postData), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            // Assuming the lambda wraps the response correctly
            setMessage(response.data.message);
        } catch (error: any) {
            console.error('Subscription Error:', error);
            setMessage('Failed to subscribe: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Subscribe to Image Tags</h1>
            <p>Email: {email}</p> {/* Display the email to the user */}
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags to subscribe (separated by commas)"
            />
            <button onClick={handleSubscribe} disabled={loading}>Subscribe</button>
            {loading && <p>Loading...</p>}
            <p>{message}</p>
        </div>
    );
};

export default TagSubscriptionComponent;
