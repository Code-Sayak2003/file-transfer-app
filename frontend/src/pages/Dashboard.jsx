// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import FileUpload from '../components/FileUpload';

// const Dashboard = () => {
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/login');
//     };

//     return (
//         <div>
//             <h2>Dashboard</h2>
//             <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2">
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';

const Dashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [fileId, setFileId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.io server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.io server');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.msg);
            setFileId(response.data.file._id);
            socket.emit('file_uploaded', response.data.file);
        } catch (error) {
            console.error('File upload failed', error);
            setMessage('File upload failed');
        }
    };

    const handleFileTransfer = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/files/transfer', { recipientEmail, fileId });
            setMessage(response.data.msg);
            socket.emit('file_transferred', { recipientEmail, fileId });
        } catch (error) {
            console.error('File transfer failed', error);
            setMessage('File transfer failed');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <button onClick={handleLogout} className="mb-4 bg-red-500 text-white p-2">
                Logout
            </button>

            <div className="mb-4">
                <form onSubmit={handleFileUpload} className="mb-4">
                    <h3 className="text-xl mb-2">Upload File</h3>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block mb-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Upload
                    </button>
                </form>
            </div>

            <div className="mb-4">
                <form onSubmit={handleFileTransfer} className="mb-4">
                    <h3 className="text-xl mb-2">Transfer File</h3>
                    <input
                        type="email"
                        placeholder="Recipient Email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="block mb-2 p-2 border"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Transfer
                    </button>
                </form>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Dashboard;
