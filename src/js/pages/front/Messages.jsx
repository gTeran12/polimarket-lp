import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
// Si no tienes el componente LoadingSpinner, puedes usar un texto simple o div
import LoadingSpinner from '../../components/LoadingSpinner'; 

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    
    // Hook para navegar
    const navigate = useNavigate();
    // Referencia para bajar el scroll automáticamente
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    // Efecto para bajar el scroll cuando llega un mensaje nuevo
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        setLoadingMessages(true);
        setError(null);
        try {
            const response = await axiosClient.get('/api/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('No se pudieron cargar los mensajes. Verifica tu conexión.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axiosClient.post('/api/messages', { message: newMessage });
            
            // Creamos el objeto mensaje para añadirlo inmediatamente a la lista (Optimistic UI)
            const messageWithUser = { 
                ...response.data, 
                user: user // Usamos el usuario del contexto actual
            };
            
            setMessages(prevMessages => [...prevMessages, messageWithUser]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('No se pudo enviar el mensaje.');
        }
    };

    if (loadingMessages) {
        return <div className="d-flex justify-content-center p-5"><LoadingSpinner /></div>;
    }

    return (
        <div className="container mt-4">
            {/* Cabecera con Botón Volver */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Chat del Sistema</h2>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate(-1)} // Esto te regresa a la página anterior
                >
                    <i className="bi bi-arrow-left"></i> Volver atrás
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Área de Mensajes */}
                    <div 
                        className="message-box mb-3 p-3 border rounded bg-light" 
                        style={{ height: '400px', overflowY: 'scroll' }}
                    >
                        {messages.length > 0 ? (
                            messages.map((message) => {
                                // Determinar si el mensaje es mío o de otro
                                const isMyMessage = message.user_id === user?.id;
                                
                                return (
                                    <div 
                                        key={message.id} 
                                        className={`d-flex mb-3 ${isMyMessage ? 'justify-content-end' : 'justify-content-start'}`}
                                    >
                                        <div 
                                            className={`p-2 rounded ${isMyMessage ? 'bg-primary text-white' : 'bg-white border'}`}
                                            style={{ maxWidth: '70%' }}
                                        >
                                            <div className="fw-bold small mb-1">
                                                {isMyMessage ? 'Tú' : (message.user?.name || 'Usuario')}
                                            </div>
                                            <div>{message.message}</div>
                                            <div className={`text-end small ${isMyMessage ? 'text-light' : 'text-muted'}`} style={{fontSize: '0.7rem'}}>
                                                {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-muted mt-5">
                                <p>No hay mensajes todavía. ¡Sé el primero!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Formulario de Envío */}
                    <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!newMessage.trim()}
                            >
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messages;