import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThumbnailToImageResolver: React.FC = () => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [idToken, setIdToken] = useState<string>('');

    // Load credentials from localStorage upon component mount
    useEffect(() => {
        const token = localStorage.getItem('idToken') || '';
        setIdToken(token);
    }, []);

    const handleResolveImage = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/query/getThumbnailOriginalUrl', {
                thumbnail_url: thumbnailUrl
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (response.data.original_url) {
                setOriginalImageUrl(response.data.original_url);
            } else {
                setError('No original image found for the provided thumbnail.');
                setOriginalImageUrl(null);
            }
        } catch (error: any) {
            setError('Failed to resolve image: ' + error.message);
            setOriginalImageUrl(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Resolve Original Image from Thumbnail</h1>
            <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Enter thumbnail URL"
            />
            <button onClick={handleResolveImage} disabled={loading || !thumbnailUrl}>
                Resolve Image
            </button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {originalImageUrl && (
                <div>
                    <h2>Original Image URL</h2>
                    <p>{originalImageUrl}</p>
                </div>
            )}
        </div>
    );
};

export default ThumbnailToImageResolver;
