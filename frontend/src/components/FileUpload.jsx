import React, { useState } from 'react';
import axios from 'axios';
import socket from '../services/socket';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/transfer/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    setProgress(percentage);
                }
            });

            socket.emit('fileTransfer', { filename: response.data.filename, recipient: 'recipientId' });
        } catch (error) {
            console.error('File upload failed', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button onClick={handleUpload} className="bg-blue-500 text-white p-2">Upload</button>
            {progress > 0 && <p>Progress: {progress}%</p>}
        </div>
    );
};

export default FileUpload;
