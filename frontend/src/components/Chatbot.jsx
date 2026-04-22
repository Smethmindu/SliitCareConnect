import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi there! Welcome to SliitCareConnect. I'm here to assist you with everything you need today. \uD83D\uDE0A",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const baseUrl = 'http://localhost:3000';
      // Send conversation history (excluding the initial greeting) for multi-turn context
      const history = messages.slice(1).map((m) => ({ role: m.role, text: m.text }));
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: data.response || 'Sorry, I encountered an error answering your request.' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Network error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSend(action);
  };

  const quickActions = ['Book an Appointment', 'Find Resources', 'Contact Admin'];

  const fabStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
    backgroundColor: '#0052cc', // BotPenguin blue style
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  };

  const windowStyle = {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '360px',
    height: '520px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000,
    fontFamily: 'sans-serif',
  };

  const headerStyle = {
    backgroundColor: '#0052cc',
    color: 'white',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const bodyStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const footerStyle = {
    padding: '12px 16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <>
      <div 
        style={fabStyle} 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </div>

      {isOpen && (
        <div style={windowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'white', color: '#0052cc', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <Bot size={24} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>SliitCare Assistant</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>Usually replies instantly</span>
              </div>
            </div>
            <X size={20} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Body */}
          <div style={bodyStyle}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  backgroundColor: msg.role === 'user' ? '#0052cc' : 'white',
                  color: msg.role === 'user' ? 'white' : '#374151',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                  border: msg.role === 'bot' ? '1px solid #e5e7eb' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginLeft: '4px' }}>
                  How can I help you? 👇
                </span>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#0052cc',
                      fontSize: '13.5px',
                      fontWeight: '500',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0052cc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '12px 16px', backgroundColor: 'white', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '14px' }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div style={footerStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your answer..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '24px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#f9fafb',
              }}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              style={{
                backgroundColor: !input.trim() || isLoading ? '#9ca3af' : '#0052cc',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </div>
          
          <div style={{ textAlign: 'center', padding: '6px', fontSize: '11px', color: '#9ca3af', borderTop: '1px solid #f3f4f6' }}>
            ⚡ by SliitCareConnect Assistant
          </div>
        </div>
      )}
    </>
  );
}
