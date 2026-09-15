"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Send, Bot, User, Code } from 'lucide-react';

export default function ChatPlayground() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, metadata?: any}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([{ path: 'src/main.ts', content: 'console.log("Hello");' }]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          files: files,
          context: []
        })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "No response received.",
        metadata: {
          provider: data.provider,
          model: data.model,
          tokens: data.tokens,
          cost: data.cost
        }
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to router API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chat Playground</h1>
        <p className={styles.subtitle}>Test the routing engine and provider models directly.</p>
      </header>

      <div className={styles.playgroundLayout}>
        <div className={`card ${styles.chatContainer}`}>
          <div className={styles.messagesList}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <Bot size={48} className={styles.emptyIcon} />
                <h3>Ready to Route</h3>
                <p>Send a prompt to see which model TokenPilot selects.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                <div className={styles.avatar}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.text}>{msg.content}</div>
                  {msg.metadata && (
                    <div className={styles.metadata}>
                      <span className={styles.badge}>{msg.metadata.provider} / {msg.metadata.model}</span>
                      <span className={styles.stat}>{msg.metadata.tokens} tokens</span>
                      <span className={styles.stat}>${msg.metadata.cost}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.avatar}><Bot size={20} /></div>
                <div className={styles.messageContent}>
                  <div className={styles.loadingDots}>
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.inputArea}>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="Ask a coding question or request a refactor..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button className="btn" onClick={handleSend} disabled={loading || !input.trim()}>
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
        
        <div className={`card ${styles.contextPanel}`}>
          <div className={styles.panelHeader}>
            <Code size={20} className={styles.panelIcon} />
            <h3>Current Context</h3>
          </div>
          <p className={styles.panelDesc}>Files sent with your prompt for context.</p>
          
          <div className={styles.fileList}>
            {files.map((file, i) => (
              <div key={i} className={styles.fileItem}>
                <div className={styles.fileName}>{file.path}</div>
                <pre className={styles.fileContent}>{file.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
