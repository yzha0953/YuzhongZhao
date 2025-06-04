import React from 'react';
import ImageUploadComponent from '../components/ImageUploadComponent';

const UploadPage: React.FC = () => {
    return (
        <div className="centered-container">
            <h1>Upload Your Image</h1>
            <p>Choose an image file and click 'Upload Image' to store it on the server.</p>
            <ImageUploadComponent />
        </div>
    );
};

export default UploadPage;
