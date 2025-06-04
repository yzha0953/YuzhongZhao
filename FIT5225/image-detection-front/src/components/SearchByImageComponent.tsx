import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchByImageComponent: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [searchMessage, setSearchMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [idToken, setIdToken] = useState<string>('');

    // Load ID token from localStorage upon component mount
    useEffect(() => {
        const savedIdToken = localStorage.getItem('idToken') || '';
        setIdToken(savedIdToken);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSearch = async () => {
        if (file && idToken) {
            setLoading(true);
            const base64String = await toBase64(file);
            const payload = {
                image: base64String
            };

            try {
                const response = await axios.post('https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/query/queryByImageFunction', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                setSearchMessage(response.data.message);
                if (response.data.links && response.data.links.length > 0) {
                    setSearchResults(response.data.links);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Search Error:', error);
                alert('Search failed, please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select an image and ensure you are logged in.');
        }
    };

    // Convert file to Base64 string
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).replace(/^data:.+;base64,/, '');
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div>
            <h1>Search Images by Your Local Image</h1>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
            <button onClick={handleSearch} disabled={!file || loading}>Search</button>
            {loading && <p>Loading...</p>}
            <p>{searchMessage}</p>
            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px' }}>
                {searchResults.length > 0 && searchResults.map((link, index) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" style={{ background: '#f0f0f0', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                        Image Link {index + 1}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SearchByImageComponent;
