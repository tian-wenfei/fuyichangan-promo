import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { generateResponse } from '../utils/chatLogic';
import { greetingMessages } from '../data/teamData';
import { useSpeechRecognition } from '../utils/speech';
import { useSpeechSynthesis } from '../utils/speech';

export type ChatState = 'idle' | 'listening' | 'thinking' | 'speaking';

// 快捷提问选项
const QUICK_QUESTIONS = [
  { icon: '👥', text: '介绍一下团队成员', query: '介绍一下团队成员' },
  { icon: '🚀', text: '团队有哪些项目', query: '你们做过哪些项目' },
  { icon: '🎯', text: '团队的愿景和使命', query: '团队的愿景是什么' },
  { icon: '📞', text: '怎么联系你们', query: '怎么联系你们' },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [currentVoiceText, setCurrentVoiceText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { startListening, stopListening: stopRecognition } = useSpeechRecognition();
  const { speak, stopSpeaking } = useSpeechSynthesis();
  const stopListeningRef = useRef<(() => void) | null>(null);
  const chatStateRef = useRef<ChatState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const startVoiceListeningRef = useRef<() => void>(() => {});

  // 同步 chatState 到 ref（避免闭包过期）
  // 同时提供一个直接更新 ref 的函数，用于需要同步读取的场景
  const setChatStateWithRef = useCallback((state: ChatState) => {
    chatStateRef.current = state;
    setChatState(state);
  }, []);

  useEffect(() => {
    chatStateRef.current = chatState;
  }, [chatState]);

  // 初始化欢迎消息
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: greetingMessages[Math.floor(Math.random() * greetingMessages.length)],
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentVoiceText, chatState]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopRecognition();
      stopSpeaking();
    };
  }, [stopRecognition, stopSpeaking]);

  // 发送消息的核心函数
  const handleSend = useCallback(async (content: string) => {
    const currentState = chatStateRef.current;
    if (currentState === 'thinking' || currentState === 'speaking') return;

    // 停止语音识别
    stopRecognition();
    stopListeningRef.current = null;
    stopSpeaking();

    setChatStateWithRef('thinking');
    setInputText('');
    setCurrentVoiceText('');
    setShowSuggestions(false);
    setErrorMessage('');

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // 模拟思考延迟
    const thinkingTime = 600 + Math.random() * 800;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const botResponse = generateResponse(content);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setChatStateWithRef('speaking');

    speak(botResponse, () => {
      setChatStateWithRef('listening');
      // 自动开始新一轮语音监听
      startVoiceListeningRef.current();
    });
  }, [stopRecognition, stopSpeaking, speak]);

  // 语音识别结果回调
  const handleVoiceResult = useCallback((text: string, isFinal: boolean) => {
    setCurrentVoiceText(text);

    if (isFinal && text.trim()) {
      // 延迟发送，给用户一点反馈时间
      const finalText = text.trim();
      setTimeout(() => {
        handleSend(finalText);
      }, 300);
    }
  }, [handleSend]);

  // 开始语音监听
  const startVoiceListening = useCallback(() => {
    const currentState = chatStateRef.current;
    if (currentState === 'thinking' || currentState === 'speaking') return;

    setChatStateWithRef('listening');
    setErrorMessage('');
    setCurrentVoiceText('');

    stopListeningRef.current = startListening(
      handleVoiceResult,
      (error) => {
        setErrorMessage(error);
        setChatStateWithRef('idle');
        setTimeout(() => setErrorMessage(''), 5000);
      },
      () => {
        // 监听结束（非主动停止时）
        if (chatStateRef.current === 'listening') {
          setChatStateWithRef('idle');
        }
      }
    );
  }, [startListening, handleVoiceResult]);

  // 同步到 ref，避免 handleSend 的循环依赖
  startVoiceListeningRef.current = startVoiceListening;

  // 停止语音监听
  const stopVoiceListening = useCallback(() => {
    stopRecognition();
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    stopSpeaking();
    setChatStateWithRef('idle');
    setCurrentVoiceText('');
  }, [stopRecognition, stopSpeaking]);

  // 切换对话状态
  const toggleChat = useCallback(() => {
    const currentState = chatStateRef.current;
    if (currentState === 'idle') {
      startVoiceListening();
    } else {
      stopVoiceListening();
    }
  }, [startVoiceListening, stopVoiceListening]);

  // 键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputText.trim()) {
      e.preventDefault();
      handleSend(inputText.trim());
    }
  }, [inputText, handleSend]);

  // 快捷提问
  const handleQuickQuestion = useCallback((query: string) => {
    handleSend(query);
  }, [handleSend]);

  return (
    <div className="chat-panel">
      {/* 头部 */}
      <div className="chat-header">
        <div className="chat-header-bg">
          <div className="header-circle header-circle-1" />
          <div className="header-circle header-circle-2" />
          <div className="header-circle header-circle-3" />
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className={`header-avatar ${chatState === 'listening' ? 'avatar-pulse-listen' : 'avatar-pulse-normal'}`}>
            <span className="text-2xl">🍃</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl tracking-wide">AI小茯</h2>
            <p className="text-teal-100/90 text-sm font-medium">
              {chatState === 'idle' && '💡 点击下方按钮或输入文字开始对话'}
              {chatState === 'listening' && (
                <span className="flex items-center gap-1.5">
                  <span className="listening-dot" />
                  正在倾听...
                </span>
              )}
              {chatState === 'thinking' && (
                <span className="flex items-center gap-1.5">
                  <span className="thinking-spinner" />
                  正在思考...
                </span>
              )}
              {chatState === 'speaking' && (
                <span className="flex items-center gap-1.5">
                  <span className="speaking-wave">🔊</span>
                  正在回答...
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {errorMessage && (
        <div className="error-banner">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
            title="关闭提示"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 消息列表 */}
      <div className="chat-messages">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="message-wrapper"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ChatMessage message={message} />
            </div>
          ))}

          {/* 实时语音文本预览 */}
          {chatState === 'listening' && currentVoiceText && (
            <div className="voice-preview-wrapper">
              <div className="voice-preview-bubble">
                <span className="voice-wave-icon">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="wave-bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </span>
                <p className="text-sm italic text-white/90">{currentVoiceText}</p>
              </div>
              <div className="voice-preview-avatar">👤</div>
            </div>
          )}

          {/* 思考中动画 */}
          {chatState === 'thinking' && (
            <div className="thinking-wrapper">
              <div className="thinking-avatar">🍃</div>
              <div className="thinking-bubble">
                <div className="thinking-dots">
                  <span className="dot" style={{ animationDelay: '0ms' }} />
                  <span className="dot" style={{ animationDelay: '0.2s' }} />
                  <span className="dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="chat-input-area">
        {/* 快捷提问 - 仅在空闲且有较少消息时显示 */}
        {showSuggestions && messages.length <= 3 && (
          <div className="quick-questions">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q.query)}
                className="quick-question-btn"
                disabled={chatState === 'thinking' || chatState === 'speaking'}
              >
                <span>{q.icon}</span>
                <span>{q.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* 文本输入 */}
        <div className="text-input-row">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatState === 'thinking' || chatState === 'speaking'}
            placeholder={
              chatState === 'listening' ? '🎤 语音识别中，请说话...' :
              chatState === 'thinking' ? '🧠 AI小茯正在思考...' :
              chatState === 'speaking' ? '🔊 AI小茯正在回答...' :
              '输入文字，或点击下方按钮开始语音对话...'
            }
            className="text-input"
          />
          <button
            onClick={() => inputText.trim() && handleSend(inputText.trim())}
            disabled={!inputText.trim() || chatState === 'thinking' || chatState === 'speaking'}
            className="send-btn"
            title="发送消息"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* 语音对话大按钮 */}
        <div className="voice-main-btn-wrapper">
          <button
            onClick={toggleChat}
            disabled={chatState === 'thinking'}
            className={`voice-main-btn voice-main-btn-${chatState}`}
            title={
              chatState === 'idle' ? '点击开始语音对话' :
              chatState === 'listening' ? '点击停止语音对话' :
              chatState === 'thinking' ? '思考中...' :
              '点击停止回答'
            }
          >
            {/* 空闲状态 - 麦克风图标 */}
            {chatState === 'idle' && (
              <>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="voice-btn-label">开始对话</span>
              </>
            )}

            {/* 监听状态 - 麦克风 + 脉冲 */}
            {chatState === 'listening' && (
              <>
                <div className="mic-listening-icon">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 19c-2.76 0-5-2.24-5-5V7c0-2.76 2.24-5 5-5s5 2.24 5 5v7c0 2.76-2.24 5-5 5z" />
                  </svg>
                  <div className="pulse-ring pulse-ring-1" />
                  <div className="pulse-ring pulse-ring-2" />
                </div>
                <span className="voice-btn-label">点击停止</span>
              </>
            )}

            {/* 回答状态 - 声波图标 */}
            {chatState === 'speaking' && (
              <>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span className="voice-btn-label">停止回答</span>
              </>
            )}

            {/* 思考状态 - 禁用 */}
            {chatState === 'thinking' && (
              <>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="voice-btn-label">思考中...</span>
              </>
            )}
          </button>
        </div>

        {/* 状态提示文字 */}
        <p className={`status-text status-text-${chatState}`}>
          {chatState === 'idle' && '💡 点击上方按钮或输入文字，与AI小茯畅聊'}
          {chatState === 'listening' && '🎤 正在倾听，请对着麦克风说话...'}
          {chatState === 'thinking' && '🧠 AI小茯正在思考如何回答您...'}
          {chatState === 'speaking' && '🔊 AI小茯正在回答，请稍候...'}
        </p>
      </div>
    </div>
  );
}
