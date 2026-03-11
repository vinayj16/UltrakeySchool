import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import chatService, { type Conversation, type Message } from '../../services/chatService';

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = localStorage.getItem('userId') || '';
  const currentUserName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      markAsRead(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const schoolId = localStorage.getItem('schoolId') || localStorage.getItem('institutionId');
      if (!schoolId || !currentUserId) {
        toast.error('School ID or User ID not found');
        return;
      }

      const response = await chatService.getConversations(schoolId, currentUserId);
      setConversations((response as any).data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      const response = await chatService.getMessages(conversationId);
      setMessages((response as any).data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await chatService.markAsRead(conversationId, currentUserId);
      fetchConversations(); // Refresh to update unread counts
    } catch (error) {
      // Silent fail
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        senderId: currentUserId,
        senderName: currentUserName,
        content: newMessage.trim(),
        messageType: 'text' as const
      };

      await chatService.sendMessage(selectedConversation._id, messageData);
      setNewMessage('');
      fetchMessages(selectedConversation._id);
      fetchConversations(); // Refresh to update last message
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowInfo(false);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.userId !== currentUserId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.unreadCount?.[currentUserId] || 0;
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = getOtherParticipant(conv);
    return (
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="content">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Chat</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/applications">Application</Link>
              </li>
              <li className="breadcrumb-item active">Chat</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light bg-white btn-icon" onClick={fetchConversations} disabled={loading}>
            <i className="ti ti-refresh"></i>
          </button>
        </div>
      </div>

      <div className="row">
        {/* Conversations List */}
        <div className="col-lg-4 col-md-5">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-3">Messages</h5>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="ti ti-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ti ti-message-off fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No conversations found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredConversations.map(conversation => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const unreadCount = getUnreadCount(conversation);
                    const isSelected = selectedConversation?._id === conversation._id;

                    return (
                      <button
                        key={conversation._id}
                        className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-3">
                            <span className="avatar-title rounded-circle bg-primary">
                              {conversation.isGroup
                                ? <i className="ti ti-users"></i>
                                : otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-0">
                                {conversation.isGroup
                                  ? conversation.title || 'Group Chat'
                                  : otherParticipant?.name || 'Unknown User'}
                              </h6>
                              {conversation.lastMessage && (
                                <small className="text-muted">
                                  {formatTime(conversation.lastMessage.sentAt)}
                                </small>
                              )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted text-truncate" style={{ maxWidth: '200px' }}>
                                {conversation.lastMessage?.message || 'No messages yet'}
                              </small>
                              {unreadCount > 0 && (
                                <span className="badge badge-soft-primary rounded-pill">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-lg-8 col-md-7">
          {selectedConversation ? (
            <div className="card">
              {/* Chat Header */}
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-md me-3">
                    <span className="avatar-title rounded-circle bg-primary">
                      {selectedConversation.isGroup
                        ? <i className="ti ti-users"></i>
                        : getOtherParticipant(selectedConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0">
                      {selectedConversation.isGroup
                        ? selectedConversation.title || 'Group Chat'
                        : getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                    </h6>
                    <small className="text-muted">
                      {selectedConversation.isGroup
                        ? `${selectedConversation.participants.length} participants`
                        : getOtherParticipant(selectedConversation)?.role || 'User'}
                    </small>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <i className="ti ti-info-circle"></i>
                </button>
              </div>

              {/* Messages Area */}
              <div className="card-body" style={{ height: '450px', overflowY: 'auto' }}>
                {messagesLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="ti ti-message-circle fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div>
                    {messages.map(message => {
                      const isOwnMessage = message.senderId === currentUserId;
                      return (
                        <div
                          key={message._id}
                          className={`d-flex mb-3 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          {!isOwnMessage && (
                            <div className="avatar avatar-sm me-2">
                              <span className="avatar-title rounded-circle bg-secondary">
                                {message.senderName?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div style={{ maxWidth: '70%' }}>
                            {!isOwnMessage && (
                              <small className="text-muted d-block mb-1">{message.senderName}</small>
                            )}
                            <div
                              className={`p-3 rounded ${
                                isOwnMessage
                                  ? 'bg-primary text-white'
                                  : 'bg-light'
                              }`}
                            >
                              <p className="mb-0">{message.content}</p>
                            </div>
                            <small className="text-muted d-block mt-1">
                              {formatTime(message.createdAt)}
                              {isOwnMessage && message.readBy && message.readBy.length > 1 && (
                                <i className="ti ti-checks ms-1"></i>
                              )}
                            </small>
                          </div>
                          {isOwnMessage && (
                            <div className="avatar avatar-sm ms-2">
                              <span className="avatar-title rounded-circle bg-primary">
                                {currentUserName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="card-footer">
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <i className="ti ti-send"></i>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-5" style={{ height: '600px' }}>
                <i className="ti ti-message-circle-2 fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">Select a conversation to start chatting</h5>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Sidebar */}
      {showInfo && selectedConversation && (
        <div
          className="offcanvas offcanvas-end show"
          style={{ visibility: 'visible' }}
          tabIndex={-1}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Conversation Info</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowInfo(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="text-center mb-4">
              <div className="avatar avatar-xl mx-auto mb-3">
                <span className="avatar-title rounded-circle bg-primary fs-3">
                  {selectedConversation.isGroup
                    ? <i className="ti ti-users"></i>
                    : getOtherParticipant(selectedConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h5>
                {selectedConversation.isGroup
                  ? selectedConversation.title || 'Group Chat'
                  : getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
              </h5>
            </div>

            <div className="mb-4">
              <h6 className="mb-3">Participants ({selectedConversation.participants.length})</h6>
              <div className="list-group">
                {selectedConversation.participants.map(participant => (
                  <div key={participant.userId} className="list-group-item">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm me-2">
                        <span className="avatar-title rounded-circle bg-secondary">
                          {participant.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0">{participant.name || 'Unknown'}</h6>
                        <small className="text-muted">{participant.role || 'User'}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
