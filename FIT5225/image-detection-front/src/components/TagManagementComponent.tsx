import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TagManagementComponent: React.FC = () => {
    const [urls, setUrls] = useState<string>('');  // To store URL inputs as comma-separated values
    const [tags, setTags] = useState<string>('');  // To store tag inputs as comma-separated values
    const [updateType, setUpdateType] = useState<number>(1);  // 1 for add, 0 for remove
    const [message, setMessage] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string>('');

    // Load credentials from localStorage upon component mount
    useEffect(() => {
        const token = localStorage.getItem('idToken') || '';
        setIdToken(token);
    }, []);

    const handleUpdateTags = async () => {
        const urlArray = urls.split(',').map(url => url.trim());  // Convert comma-separated URLs into an array
        const tagArray = tags.split(',').map(tag => tag.trim());  // Convert comma-separated tags into an array

        try {
            const response = await axios.post('https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/query/updateImageTagsFunction', {
                url: urlArray,
                type: updateType,
                tags: tagArray
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (updateType === 1) {
                setMessage(`${response.data.message}: Added`);
            } else {
                setMessage(` ${response.data.message}: Removed`);
            }
        } catch (error: any) {
            setMessage(`Failed to update tags: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Manage Image Tags</h1>
            <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter image URLs separated by comma"
                style={{ width: '100%', minHeight: '100px' }}
            />
            <textarea
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                style={{ width: '100%', minHeight: '50px' }}
            />
            <div className='select-box'>
                <label htmlFor="updateType">Action:</label>
                <select id="updateType" value={updateType} onChange={(e) => setUpdateType(Number(e.target.value))}>
                    <option value={1}>Add Tags</option>
                    <option value={0}>Remove Tags</option>
                </select>
            </div>
            <button onClick={handleUpdateTags} disabled={!urls || !tags || !idToken}>Update Tags</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TagManagementComponent;
