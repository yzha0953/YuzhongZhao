import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUploadComponent: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    const [idToken, setIdToken] = useState<string>('');

    // Load credentials from localStorage upon component mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || '';
        const savedIdToken = localStorage.getItem('idToken') || '';
        setUsername(savedUsername);
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

    const handleUpload = async () => {
        if (file && username && idToken) {
            const base64String = await toBase64(file);
            const payload = {
                username: username,
                filename: file.name,
                image: base64String
            };

            console.log('Sending with ID Token:', idToken);
            console.log('username', username) // Debug: Check the token value
            console.log('filename', file.name) // Debug: Check the token value
            console.log('image', base64String) // Debug: Check the token value

            try {
                const response = await axios.post('https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/upload-image', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                if (response.data) {
                    alert('Image is uploaded successfully!');
                    console.log('Image is uploaded:', response.data);
                } else {
                    throw new Error('Upload failed, please retry');
                }
            } catch (error) {
                console.error('Upload Error:', error);
                alert('Uploading failed, please retry');
            }
        } else {
            alert('Please select a file and make sure you are logged in.');
        }
    };

    // Convert file to Base64 string
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Extract the Base64 string from the Data URL
                const base64String = (reader.result as string).replace(/^data:.+;base64,/, '');
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
            <button onClick={handleUpload} disabled={!file}>Upload Image</button>
        </div>
    );
};

export default ImageUploadComponent;
