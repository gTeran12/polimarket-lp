import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        setError(null);
        try {
            const response = await axiosClient.get('/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('No se pudieron cargar los mensajes. Por favor, inténtelo de nuevo más tarde.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axiosClient.post('/messages', { message: newMessage });
            // Add the new message to the state, including user information
            const messageWithUser = { ...response.data, user: user };
            setMessages(prevMessages => [...prevMessages, messageWithUser]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('No se pudo enviar el mensaje.');
        }
    };

    if (loadingMessages) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="border rounded-lg p-4 h-96 overflow-y-scroll mb-4">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message.id} className="mb-2">
                            <span className="font-bold">{message.user?.name || 'Invitado'}: </span>
                            <span>{message.message}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                {new Date(message.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">No hay mensajes todavía.</div>
                )}
            </div>
            <form onSubmit={handleSendMessage}>
                <div className="flex">
                    <input
                        type="text"
                        className="flex-grow border rounded-l-lg p-2"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Messages;