import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, TextField, Typography, Avatar, Paper } from '@mui/material';
import { Close as CloseIcon, ArrowUpward as SendIcon, ChatBubbleOutline } from '@mui/icons-material';

const initialMessages = [
  { sender: 'flynn', text: 'Welcome. I am Flynn, your dedicated design consultant. Are we curating pieces for a specific room today, or perhaps refining the aesthetic across your entire home?' }
];

const FlynnAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openFlynn', handleOpen);
    return () => window.removeEventListener('openFlynn', handleOpen);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate professional AI response
    setTimeout(() => {
      let responseText = "Excellent direction. Given those parameters, I would suggest surveying our Autumn Series. The use of natural oak paired with sophisticated silhouettes would elevate the space considerably.";
      
      const lowerInput = userMessage.text.toLowerCase();
      if (lowerInput.includes('living room') || lowerInput.includes('sofa')) {
        responseText = "For your living room, the Levitas Sofa is a remarkable centerpiece. Its architectural lines anchor the room beautifully while providing uncompromising comfort. Should I present the fabric swatches?";
      } else if (lowerInput.includes('bedroom') || lowerInput.includes('bed')) {
         responseText = "The bedroom requires sanctuary-level refinement. Our platform beds, crafted from sustainable walnut, provide a grounding presence. What tonal palette are you envisioning?";
      }

      setMessages((prev) => [...prev, { sender: 'flynn', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Grounded Minimal Chat Button */}
      {!isOpen && (
        <Box
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            borderRadius: 'var(--lx-radius-lg)',
            background: 'var(--lx-surface-elevated)',
            border: '1px solid var(--lx-border-light)',
            boxShadow: 'var(--lx-shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1300,
            transition: 'var(--lx-transition)',
            '&:hover': {
              background: 'var(--lx-beige)',
              borderColor: 'var(--lx-beige)',
              '& svg': { color: 'var(--lx-black)' }
            }
          }}
        >
          <ChatBubbleOutline sx={{ color: 'var(--lx-text-primary)', transition: 'color 0.3s ease' }} />
        </Box>
      )}

      {/* Clean Chat Panel */}
      {isOpen && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 360,
            height: 540,
            maxHeight: 'calc(100vh - 64px)',
            maxWidth: 'calc(100vw - 64px)',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            background: 'var(--lx-charcoal)',
            border: '1px solid var(--lx-border)',
            boxShadow: 'var(--lx-shadow-lg)',
            animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              background: 'var(--lx-surface-elevated)',
              borderBottom: '1px solid var(--lx-border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'var(--lx-beige)',
                  color: 'var(--lx-black)',
                  width: 32,
                  height: 32,
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                F
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, lineHeight: 1.2, color: 'var(--lx-text-primary)' }}>
                  Flynn Consultant
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--lx-text-secondary)', fontFamily: '"Inter", sans-serif' }}>
                  Typically replies instantly
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'var(--lx-text-secondary)', '&:hover': { color: 'var(--lx-text-primary)', background: 'var(--lx-border-light)' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              background: 'var(--lx-black)',
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-thumb': { background: 'var(--lx-border)', borderRadius: 2 }
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderBottomRightRadius: msg.sender === 'user' ? 0 : 8,
                    borderBottomLeftRadius: msg.sender === 'flynn' ? 0 : 8,
                    background: msg.sender === 'user' ? 'var(--lx-surface-elevated)' : 'transparent',
                    border: msg.sender === 'user' ? '1px solid var(--lx-surface-elevated)' : '1px solid var(--lx-border)',
                    color: 'var(--lx-text-primary)',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                 <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    borderBottomLeftRadius: 0,
                    background: 'transparent',
                    border: '1px solid var(--lx-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lx-text-tertiary)', animation: 'fadeIn 1s infinite alternate' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lx-text-tertiary)', animation: 'fadeIn 1s infinite alternate 0.2s' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lx-text-tertiary)', animation: 'fadeIn 1s infinite alternate 0.4s' }} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid var(--lx-border-light)',
              background: 'var(--lx-charcoal)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
             <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Message Flynn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'var(--lx-surface)',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.85rem',
                  '& input': { padding: '12px 16px' },
                  '& fieldset': { borderColor: 'var(--lx-border-light)' },
                  '&:hover fieldset': { borderColor: 'var(--lx-border)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--lx-beige)' },
                }
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                background: input.trim() ? 'var(--lx-beige)' : 'var(--lx-surface)',
                color: input.trim() ? 'var(--lx-black)' : 'var(--lx-text-tertiary)',
                borderRadius: 2,
                p: '10px',
                transition: 'var(--lx-transition)',
                '&:hover': {
                  background: input.trim() ? 'var(--lx-text-primary)' : 'var(--lx-surface)',
                }
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default FlynnAssistant;
