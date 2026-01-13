import React from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

// 簡單回覆配置（之後可換成 AI）
const config = {
  initialMessages: [
    {
      type: 'bot',
      text: '你好！我是2026未來科技助手，想問量子、生物革命、或睡覺賺錢的方法嗎？😎',
    },
  ],
  widgets: [],
};

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.includes('賺錢') || message.includes('睡覺')) {
      actions.handleMoney();
    } else if (message.includes('量子') || message.includes('生物')) {
      actions.handleTech();
    } else {
      actions.handleDefault();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleMoney = () => {
    const botMessage = createChatBotMessage('睡覺賺錢的未來方式：加入我們的AI代理工具箱，自動化內容生成 + 聯盟行銷，每月被動收入！想知道詳細步驟嗎？');
    updateState(botMessage);
  };

  const handleTech = () => {
    const botMessage = createChatBotMessage('2026量子與生物革命：量子電腦將解決複雜優化問題，生物科技如CRISPR會重塑醫療。想深入哪個領域？');
    updateState(botMessage);
  };

  const handleDefault = () => {
    const botMessage = createChatBotMessage('抱歉，我還在學習中！可以問量子電腦、生物科技、AI代理，或睡覺賺錢嗎？🚀');
    updateState(botMessage);
  };

  const updateState = (message) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMoney,
            handleTech,
            handleDefault,
          },
        });
      })}
    </div>
  );
};

function App() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 粒子背景 */}
      <Particles
        id="particles-js"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 120,
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' } },
            modes: { repulse: { distance: 200, duration: 0.4 } },
          },
          particles: {
            color: { value: ['#00bfff', '#8a2be2'] },
            links: { color: '#00bfff', distance: 150, enable: true, opacity: 0.5 },
            move: { direction: 'none', enable: true, outModes: 'bounce', speed: 2 },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 5 } },
          },
        }}
      />

      {/* 主內容 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '50px', textAlign: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="neon-glow"
          style={{ fontSize: '64px', marginBottom: '40px' }}
        >
          量子與生物革命前端 – 2026未來科技誕生
        </motion.h1>

        {/* 三區塊 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
          <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ border: '2px solid #00bfff', boxShadow: '0 0 20px #00bfff', padding: '30px', width: '30%', borderRadius: '15px' }}>
            <h2 className="neon-glow">量子電腦</h2>
            <p>探索量子計算如何改變未來賺錢方式，模擬超級運算。</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ border: '2px solid #8a2be2', boxShadow: '0 0 20px #8a2be2', padding: '30px', width: '30%', borderRadius: '15px' }}>
            <h2 className="neon-glow">生物科技</h2>
            <p>基因編輯與生物革命，2026年將重塑人類生活與產業。</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} style={{ border: '2px solid #00bfff', boxShadow: '0 0 20px #00bfff', padding: '30px', width: '30%', borderRadius: '15px' }}>
            <h2 className="neon-glow">AI代理</h2>
            <p>自動化AI代理，幫助你睡覺也能賺錢的未來工具。</p>
          </motion.div>
        </div>

        {/* 聊天機器人 */}
        <div style={{ marginTop: '60px', maxWidth: '400px', margin: '60px auto' }}>
          <h2 className="neon-glow" style={{ marginBottom: '20px' }}>未來科技助手</h2>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      </div>
    </div>
  );
}

export default App;