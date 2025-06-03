import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BulkImageDeleteComponent: React.FC = () => {
    const [urls, setUrls] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [idToken, setIdToken] = useState<string>('');

    // Load credentials from localStorage upon component mount
    useEffect(() => {
        const token = localStorage.getItem('idToken') || '';
        setIdToken(token);
    }, []);

    const handleDelete = async () => {
        setLoading(true);
        const apiEndpoint = 'https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/query/deleteImages';
        try {
            const response = await axios.post(apiEndpoint, {
                url: urls.split(',').map(url => url.trim()),  // Assuming URLs are entered separated by comma
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`  // Using the ID token for authentication
                }
            });
            const data = response.data;
            // Update feedback based on response from the Lambda function
            setFeedback(`${data.message}: ${data.deleted_items.length} items deleted.`);
        } catch (error: any) {
            setFeedback(`Failed to delete images: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Bulk Delete Images</h1>
            <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter image URLs separated by comma"
                style={{ width: '300px', height: '300px' }}
            ></textarea>
            <button onClick={handleDelete} disabled={loading}>
                Delete Images
            </button>
            {loading && <p>Loading...</p>}
            <p>{feedback}</p>
        </div>
    );
};

export default BulkImageDeleteComponent;
