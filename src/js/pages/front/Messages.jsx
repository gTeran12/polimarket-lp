import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox');
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
            setError('No se pudieron cargar los mensajes. Por favor, intentelo de nuevo mas tarde.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setError(null);
            const response = await axiosClient.post('/messages', { message: newMessage });
            // Add the new message to the state, including user information
            const messageWithUser = { ...response.data, user: user };
            setMessages((prevMessages) => [...prevMessages, messageWithUser]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('No se pudo enviar el mensaje.');
        }
    };

    const isMyMessage = (message) => {
        if (!user?.id) return false;
        const messageUserId = message.user?.id ?? message.user_id;
        if (messageUserId === null || messageUserId === undefined) return false;
        return String(messageUserId) === String(user.id);
    };

    const totalCount = messages.length;
    const myCount = user ? messages.filter(isMyMessage).length : 0;
    const showMessages = activeTab !== 'new';
    const visibleMessages = activeTab === 'mine' ? messages.filter(isMyMessage) : messages;

    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.trim().split(' ').filter(Boolean);
        if (!words.length) return 'U';
        const first = words[0][0] || '';
        const second = words.length > 1 ? words[1][0] || '' : '';
        return `${first}${second}`.toUpperCase();
    };

    if (loadingMessages) {
        return <LoadingSpinner />;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container py-4 flex-grow-1">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Mensajes</h1>
                    <p className="text-muted mb-0">Revisa tus conversaciones y envia nuevos mensajes.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={fetchMessages}
                    >
                        Actualizar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveTab('new')}
                    >
                        Nuevo mensaje
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <ul className="nav nav-tabs mb-0" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        className={`nav-link ${activeTab === 'inbox' ? 'active' : ''}`}
                        aria-selected={activeTab === 'inbox'}
                        onClick={() => setActiveTab('inbox')}
                    >
                        Bandeja <span className="badge bg-secondary ms-2">{totalCount}</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        className={`nav-link ${activeTab === 'mine' ? 'active' : ''}`}
                        aria-selected={activeTab === 'mine'}
                        onClick={() => setActiveTab('mine')}
                    >
                        Mis mensajes <span className="badge bg-secondary ms-2">{myCount}</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        className={`nav-link ${activeTab === 'new' ? 'active' : ''}`}
                        aria-selected={activeTab === 'new'}
                        onClick={() => setActiveTab('new')}
                    >
                        Nuevo
                    </button>
                </li>
            </ul>

                <div className="border border-top-0 rounded-bottom bg-white shadow-sm p-4">
                    {showMessages ? (
                        <div className="border rounded-3">
                            {visibleMessages.length > 0 ? (
                                <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '420px' }}>
                                    {visibleMessages.map((message) => {
                                        const senderName = message.user?.name || 'Invitado';
                                        const mine = isMyMessage(message);
                                        const createdAt = message.created_at
                                            ? new Date(message.created_at).toLocaleString()
                                            : '';

                                        return (
                                            <div key={message.id} className={`list-group-item ${mine ? 'bg-light' : ''}`}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div
                                                        className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${mine ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                                        style={{ width: '42px', height: '42px' }}
                                                    >
                                                        {getInitials(senderName)}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="fw-semibold">
                                                                {senderName}
                                                                {mine && <span className="badge bg-light text-dark ms-2">Tu mensaje</span>}
                                                            </div>
                                                            {createdAt && (
                                                                <span className="text-muted small">{createdAt}</span>
                                                            )}
                                                        </div>
                                                        <p className="mb-0 text-secondary text-break">{message.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-2">No hay mensajes todavia.</div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setActiveTab('new')}
                                    >
                                        Escribir un mensaje
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="bg-light border rounded-3 p-4">
                            <div className="mb-3">
                                <label htmlFor="messageInput" className="form-label fw-semibold">
                                    Tu mensaje
                                </label>
                                <textarea
                                    id="messageInput"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                <span className="text-muted small">
                                    Se envia como {user?.name || 'Invitado'}
                                </span>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!newMessage.trim()}
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
