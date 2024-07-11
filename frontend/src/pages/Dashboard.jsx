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
//             <FileUpload />
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
            setMessage('File upload failed!');
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
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className="container w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h2 className="text-3xl font-semibold text-center text-gray-300">Dashboard</h2>

                <div className="mb-4">
                    <form onSubmit={handleFileUpload} className="max-w-md mx-auto p-4">
                        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Upload File</h3>
                        <div>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="file-input file-input-bordered file-input-accent w-full max-w-xs h-8"
                            />
                        </div>
                        <button type="submit" className="text-white p-2 btn btn-outline btn-sm mt-4 btn-info">
                            Upload
                        </button>
                    </form>
                </div>

                {message && <p className='text-xl font-semibold text-center text-gray-300'>{message}</p>}

                <div className="mb-4">
                    <form onSubmit={handleFileTransfer} className="max-w-md mx-auto p-4">
                        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Transfer File</h3>
                        <div>
                            <label className='label p-2'>
                                <span className='text-base label-text text-gray-300'>Recipient Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="john@email.com"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                className="w-full input input-bordered h-10"
                            />
                        </div>
                        <button type="submit" className="text-white p-2 btn btn-outline btn-sm mt-4 btn-info">
                        Transfer
                    </button>
                </form>
            </div>


            <div>
                <button onClick={handleLogout} className="mb-4 bg-red-500 text-white p-2 btn btn-error btn-sm w-24">
                    Logout
                </button>
            </div>
        </div>
        </div >
    );
};

export default Dashboard;
