import React, { useState, useRef, useEffect } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '你好！我是2026未來科技助手，專門回答量子計算、生物科技、AI自動化等未來科技問題！😎',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 自動滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // DeepSeek API 調用
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是2026未來科技助手，專注於量子計算、生物科技、AI自動化、睡覺賺錢等未來科技主題的回答。回答要專業且有科技感。'
            },
            { role: 'user', content: input }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API請求失敗 (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || '抱歉，我沒有收到有效的回覆。';

      setMessages(prev => [...prev, {
        type: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (error) {
      console.error('完整的錯誤詳情:', error);
      let errorMessage = '對話出錯，請稍後再試。';

      if (error.message.includes('401')) {
        errorMessage = 'API金鑰無效或已過期。';
      } else if (error.message.includes('429')) {
        errorMessage = '請求過於頻繁，請稍後再試。';
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        text: `錯誤: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 預設問題範例
  const exampleQuestions = [
    "什麼是量子計算？",
    "生物科技如何改變醫療？",
    "如何用AI自動賺錢？",
    "2026年最重要的科技趨勢是什麼？",
    "解釋量子糾纏"
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'rgba(10, 25, 47, 0.95)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 191, 255, 0.3)',
      border: '1px solid rgba(0, 191, 255, 0.3)'
    }}>
      {/* 聊天機器人標頭 */}
      <div style={{
        background: 'linear-gradient(45deg, #00bfff, #8a2be2)',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>2026未來科技助手</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>DeepSeek AI 驅動</div>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '0.8rem'
        }}>
          {isLoading ? '思考中...' : '線上'}
        </div>
      </div>

      {/* 範例問題區域 */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: 'rgba(0, 191, 255, 0.1)',
        borderBottom: '1px solid rgba(0, 191, 255, 0.2)'
      }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '8px', opacity: 0.8 }}>
          試試問這些問題：
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(question);
                setTimeout(() => {
                  const inputField = document.querySelector('input[type="text"]');
                  if (inputField) inputField.focus();
                }, 50);
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '15px',
                border: '1px solid rgba(0, 191, 255, 0.5)',
                backgroundColor: 'rgba(0, 191, 255, 0.1)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 191, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 191, 255, 0.1)'}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* 聊天訊息區域 */}
      <div style={{
        height: '400px',
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: 'rgba(10, 25, 47, 0.9)'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '15px',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              gap: '10px'
            }}>
              {message.type === 'bot' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #00bfff, #8a2be2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  🤖
                </div>
              )}

              <div style={{
                maxWidth: message.type === 'user' ? '85%' : '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '4px',
                  padding: '0 8px'
                }}>
                  {message.type === 'bot' ? '未來科技助手' : '您'} • {message.timestamp}
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: message.type === 'user' ? '15px 5px 15px 15px' : '5px 15px 15px 15px',
                    backgroundColor: message.type === 'user'
                      ? 'rgba(138, 43, 226, 0.25)'
                      : 'rgba(0, 191, 255, 0.25)',
                    border: `1px solid ${message.type === 'user'
                      ? 'rgba(138, 43, 226, 0.5)'
                      : 'rgba(0, 191, 255, 0.5)'}`,
                    color: 'white',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {message.text}
                  {isLoading && index === messages.length - 1 && message.type === 'bot' && (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#00bfff',
                        animation: 'bounce 1.4s infinite ease-in-out both'
                      }} />
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#8a2be2',
                        animation: 'bounce 1.4s infinite ease-in-out both 0.2s'
                      }} />
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#00ff88',
                        animation: 'bounce 1.4s infinite ease-in-out both 0.4s'
                      }} />
                    </div>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  👤
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 輸入區域 */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid rgba(0, 191, 255, 0.3)',
        backgroundColor: 'rgba(10, 25, 47, 0.95)'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="輸入您的問題（按 Enter 發送）..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 15px',
              borderRadius: '25px',
              border: `1px solid ${isLoading ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 191, 255, 0.5)'}`,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              outline: 'none',
              fontSize: '0.95rem',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: '12px 25px',
              borderRadius: '25px',
              border: 'none',
              background: isLoading
                ? 'linear-gradient(45deg, #666, #888)'
                : 'linear-gradient(45deg, #00bfff, #0088cc)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => !isLoading && (e.target.style.opacity = '1')}
          >
            {isLoading ? '發送中...' : '發送'}
          </button>
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          使用 DeepSeek AI 提供服務
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00bfff, #8a2be2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #00bfff, #8a2be2, #00ff88);
        }
      `}</style>
    </div>
  );
};

function App() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0a192f' }}>
      {/* 粒子背景 */}
      <Particles
        id="particles-js"
        init={particlesInit}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        options={{
          background: {
            color: {
              value: 'transparent'
            }
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              onClick: {
                enable: true,
                mode: "push",
              }
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
              push: {
                quantity: 4,
              },
            },
          },
          particles: {
            color: {
              value: ["#00bfff", "#8a2be2", "#00ff88"],
            },
            links: {
              color: "#00bfff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* 主內容 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '50px 20px', textAlign: 'center', color: 'white' }}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #00bfff, #8a2be2, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0, 191, 255, 0.3)',
          }}
        >
          量子與生物革命前端
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '40px',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          2026未來科技誕生
        </motion.h2>

        {/* 三個專業區塊 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          marginBottom: '60px',
          maxWidth: '1200px',
          margin: '0 auto 60px'
        }}>
          {[
            {
              title: "量子電腦",
              description: "探索量子計算如何改變未來賺錢方式，模擬超級運算。量子糾纏與疊加態將徹底顛覆傳統計算。",
              color: "#00bfff",
              icon: "⚛️"
            },
            {
              title: "生物科技",
              description: "基因編輯與生物革命，2026年將重塑人類生活與產業。CRISPR與合成生物學引領新時代。",
              color: "#8a2be2",
              icon: "🧬"
            },
            {
              title: "AI代理",
              description: "自動化AI代理，幫助你睡覺也能賺錢的未來工具。自主學習與決策系統全天候工作。",
              color: "#00ff88",
              icon: "🤖"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              style={{
                border: `2px solid ${item.color}`,
                boxShadow: `0 0 30px ${item.color}40`,
                padding: '30px 20px',
                width: '100%',
                maxWidth: '350px',
                borderRadius: '15px',
                backgroundColor: 'rgba(10, 25, 47, 0.7)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>
                {item.icon}
              </div>
              <h2 style={{
                color: item.color,
                fontSize: '1.8rem',
                marginBottom: '15px',
                textShadow: `0 0 15px ${item.color}80`
              }}>
                {item.title}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 聊天機器人 */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <h2 style={{
            marginBottom: '20px',
            fontSize: '2.2rem',
            background: 'linear-gradient(45deg, #00ff88, #00bfff, #8a2be2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 25px rgba(0, 255, 136, 0.3)'
          }}>
            🤖 未來科技助手
          </h2>

          <p style={{
            marginBottom: '30px',
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            我是您的AI助手，專門回答關於量子計算、生物科技、AI自動化等未來科技問題！
          </p>

          <SimpleChatbot />
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          overflow-x: hidden;
        }

        input, button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

export default App;