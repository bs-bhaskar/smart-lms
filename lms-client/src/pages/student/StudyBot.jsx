import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const TypingDots = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 0',
    }}
  >
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#6366f1',
          animation: 'bounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const MarkdownContent = ({ content }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1
          style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: '12px 0 8px',
          }}
        >
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '700',
            margin: '12px 0 8px',
          }}
        >
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            margin: '10px 0 6px',
          }}
        >
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p
          style={{
            margin: '7px 0',
          }}
        >
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul
          style={{
            paddingLeft: '20px',
            margin: '8px 0',
          }}
        >
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol
          style={{
            paddingLeft: '20px',
            margin: '8px 0',
          }}
        >
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li
          style={{
            marginBottom: '4px',
          }}
        >
          {children}
        </li>
      ),

      strong: ({ children }) => (
        <strong
          style={{
            fontWeight: '700',
          }}
        >
          {children}
        </strong>
      ),

      blockquote: ({ children }) => (
        <blockquote
          style={{
            borderLeft: '4px solid #6366f1',
            paddingLeft: '12px',
            margin: '10px 0',
            color: '#4b5563',
          }}
        >
          {children}
        </blockquote>
      ),

      code: ({ className, children, ...props }) => {
        const isInline = !className;

        if (isInline) {
          return (
            <code
              style={{
                background: '#ede9fe',
                color: '#4f46e5',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '13px',
              }}
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <pre
            style={{
              background: '#1e1b4b',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '13px',
              lineHeight: '1.5',
              margin: '10px 0',
            }}
          >
            <code className={className}>{children}</code>
          </pre>
        );
      },

      table: ({ children }) => (
        <div
          style={{
            overflowX: 'auto',
            margin: '10px 0',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            {children}
          </table>
        </div>
      ),

      th: ({ children }) => (
        <th
          style={{
            border: '1px solid #ddd6fe',
            padding: '8px',
            background: '#ede9fe',
            textAlign: 'left',
            fontWeight: '700',
          }}
        >
          {children}
        </th>
      ),

      td: ({ children }) => (
        <td
          style={{
            border: '1px solid #ddd6fe',
            padding: '8px',
          }}
        >
          {children}
        </td>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const Message = ({ msg }) => {
  const isUser = msg.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'fadeSlideIn 0.3s ease',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            marginRight: '10px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
          }}
        >
          🤖
        </div>
      )}

      <div
        style={{
          maxWidth: '75%',
          padding: '12px 16px',
          borderRadius: isUser
            ? '18px 18px 4px 18px'
            : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : '#f8f7ff',
          color: isUser ? '#fff' : '#1e1b4b',
          fontSize: '14px',
          lineHeight: '1.6',
          boxShadow: isUser
            ? '0 4px 12px rgba(99,102,241,0.3)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          overflowWrap: 'anywhere',
          border: isUser
            ? 'none'
            : '1px solid #e8e5ff',
        }}
      >
        <MarkdownContent content={msg.content} />

        <div
          style={{
            fontSize: '11px',
            marginTop: '6px',
            opacity: 0.6,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            marginLeft: '10px',
            flexShrink: 0,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
};

const SUGGESTIONS = [
  'Explain recursion in simple terms',
  'How do I prepare for exams effectively?',
  'What is object-oriented programming?',
  'Give me a study plan for this week',
  'Explain the difference between stack and queue',
];

export default function StudyBot() {
  const { token } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI Study Assistant 🎓\n\nI can help you understand concepts, create study plans, answer questions about your courses, and much more.\n\nWhat would you like to learn today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const prompt = text || input.trim();

    if (!prompt || loading) return;

    /*
     * Save current conversation before adding
     * the new user message.
     */
    const history = messages
      .filter(
        (msg) =>
          msg.role === 'user' ||
          msg.role === 'assistant'
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const userMsg = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post(
        '/student/study-bot',
        {
          prompt,
          history,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const answer =
        res.data.answer ||
        'Sorry, I could not get a response.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
          timestamp: new Date(),
          source: res.data.source,
        },
      ]);
    } catch (err) {
      console.error('Study bot error:', err);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Chat cleared! How can I help you study today? 🎓',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '8px',
        fontFamily: "'Georgia', serif",
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }

          30% {
            transform: translateY(-6px);
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.5;
          }
        }

        .send-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          ) !important;
        }

        .send-btn:active {
          transform: scale(0.97);
        }

        .suggestion-btn:hover {
          background: #ede9fe !important;
          border-color: #6366f1 !important;
          transform: translateY(-1px);
        }

        .clear-btn:hover {
          background: #fee2e2 !important;
          color: #ef4444 !important;
        }

        textarea:focus {
          outline: none;
        }

        .chat-input:focus {
          box-shadow:
            0 0 0 3px rgba(99,102,241,0.15) !important;
          border-color: #6366f1 !important;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          background:
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          borderRadius: '16px 16px 0 0',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow:
            '0 4px 20px rgba(99,102,241,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              backdropFilter: 'blur(10px)',
            }}
          >
            🤖
          </div>

          <div>
            <h1
              style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
              }}
            >
              AI Study Assistant
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '2px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  animation: 'pulse 2s infinite',
                }}
              />

              <span
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '13px',
                }}
              >
                Online • Powered by AI
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="clear-btn"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border:
              '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            padding: '7px 10px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          background: '#fefeff',
          borderLeft: '1px solid #e8e5ff',
          borderRight: '1px solid #e8e5ff',
        }}
      >
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                marginRight: '10px',
              }}
            >
              🤖
            </div>

            <div
              style={{
                padding: '12px 16px',
                background: '#f8f7ff',
                borderRadius:
                  '18px 18px 18px 4px',
                border: '1px solid #e8e5ff',
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '10px 12px',
            background: '#fafafe',
            borderLeft: '1px solid #e8e5ff',
            borderRight: '1px solid #e8e5ff',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="suggestion-btn"
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 14px',
                borderRadius: '20px',
                border:
                  '1px solid #c7d2fe',
                background: '#f5f3ff',
                color: '#4f46e5',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '12px',
          background: '#fff',
          borderRadius: '0 0 16px 16px',
          borderTop: '1px solid #e8e5ff',
          border:
            '1px solid #e8e5ff',
          boxShadow:
            '0 4px 20px rgba(99,102,241,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your studies... (Enter to send)"
            rows={1}
            className="chat-input"
            style={{
              flex: 1,
              minWidth: 0,
              boxSizing: 'border-box',
              padding: '12px 16px',
              borderRadius: '12px',
              border:
                '1.5px solid #e0dcff',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none',
              lineHeight: '1.5',
              color: '#1e1b4b',
              background: '#fafafe',
              transition: 'all 0.2s',
              maxHeight: '120px',
              overflow: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height =
                Math.min(
                  e.target.scrollHeight,
                  120
                ) + 'px';
            }}
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={
              loading || !input.trim()
            }
            className="send-btn"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              background:
                loading || !input.trim()
                  ? '#c7d2fe'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: '20px',
              cursor:
                loading || !input.trim()
                  ? 'not-allowed'
                  : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
              boxShadow:
                loading || !input.trim()
                  ? 'none'
                  : '0 4px 12px rgba(99,102,241,0.4)',
            }}
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}