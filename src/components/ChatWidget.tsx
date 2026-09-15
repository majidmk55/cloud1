import { useState } from 'react';
import { X, Send } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: 'سلام! من دستیار هوش مصنوعی ابران سیستم هستم. چطور می‌توانم کمکتان کنم؟', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isBot: false }]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: 'ممنون از پیام شما! تیم پشتیبانی ما به زودی با شما تماس خواهد گرفت. آیا سوال دیگری دارید؟',
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="چت با پشتیبانی هوش مصنوعی"
      >
        {/* 3D Plastic Icon with SVG */}
        <div className="relative">
          {/* Shadow */}
          <div className="absolute inset-0 blur-xl bg-orange-500/30 translate-y-2"></div>
          
          {/* Main Icon Container */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="relative drop-shadow-2xl transition-transform group-hover:scale-110"
          >
            {/* Headset Frame - Dark Gray */}
            <path
              d="M 20 35 Q 20 20 40 20 Q 60 20 60 35 L 60 45 Q 60 50 55 50 L 52 50 L 52 40 Q 52 35 48 35 L 32 35 Q 28 35 28 40 L 28 50 L 25 50 Q 20 50 20 45 Z"
              fill="#3a3a3a"
              stroke="#2a2a2a"
              strokeWidth="1"
            />
            
            {/* Headset Ear Cushions - Orange */}
            <ellipse cx="24" cy="45" rx="6" ry="8" fill="#ff8c42" stroke="#e67e22" strokeWidth="1" />
            <ellipse cx="56" cy="45" rx="6" ry="8" fill="#ff8c42" stroke="#e67e22" strokeWidth="1" />
            
            {/* Microphone Arm */}
            <path
              d="M 56 50 Q 58 55 60 58 L 62 60"
              fill="none"
              stroke="#3a3a3a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="62" cy="60" r="2" fill="#3a3a3a" />
            
            {/* Speech Bubble - Orange with 3D Effect */}
            <defs>
              <radialGradient id="bubbleGradient" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#ffb380" />
                <stop offset="50%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#e67e22" />
              </radialGradient>
              <filter id="emboss">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <circle
              cx="40"
              cy="38"
              r="18"
              fill="url(#bubbleGradient)"
              filter="url(#emboss)"
              stroke="#e67e22"
              strokeWidth="1"
            />
            
            {/* Specular Highlight */}
            <ellipse
              cx="35"
              cy="32"
              rx="8"
              ry="6"
              fill="white"
              opacity="0.4"
            />
            
            {/* AI Text */}
            <text
              x="40"
              y="43"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              AI
            </text>
          </svg>

          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            1
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-lg">AI</span>
              </div>
              <div>
                <h3 className="text-white font-bold">پشتیبانی هوش مصنوعی</h3>
                <p className="text-white/80 text-xs">آنلاین • پاسخ فوری</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.isBot
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSend}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
