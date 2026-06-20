import { useState, useCallback } from 'react';
import { Message } from '../types';
import { useSpeechSynthesis } from '../utils/speech';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { speak, stopSpeaking } = useSpeechSynthesis();

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speak(message.content, () => {
      setIsSpeaking(false);
    });
  }, [isSpeaking, message.content, speak, stopSpeaking]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [message.content]);

  return (
    <div className={`msg-row ${isUser ? 'msg-row-user' : 'msg-row-bot'}`}>
      <div className={`msg-wrapper ${isUser ? 'msg-wrapper-user' : 'msg-wrapper-bot'}`}>
        {/* 头像 */}
        <div className={`msg-avatar ${isUser ? 'msg-avatar-user' : 'msg-avatar-bot'}`}>
          {isUser ? '👤' : '🍃'}
        </div>

        {/* 消息气泡 */}
        <div className={`msg-bubble ${isUser ? 'msg-bubble-user' : 'msg-bubble-bot'}`}>
          <p className="msg-text">{message.content}</p>

          {/* 底部操作栏 */}
          <div className={`msg-footer ${isUser ? 'msg-footer-user' : 'msg-footer-bot'}`}>
            <span className="msg-time">
              {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>

            <div className="msg-actions">
              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className={`msg-action-btn ${isCopied ? 'msg-action-active' : ''}`}
                title={isCopied ? '已复制' : '复制消息'}
              >
                {isCopied ? (
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* 语音按钮（仅bot消息） */}
              {!isUser && (
                <button
                  onClick={handleSpeak}
                  className={`msg-action-btn ${isSpeaking ? 'msg-action-active msg-action-speaking' : ''}`}
                  title={isSpeaking ? '停止播放' : '语音朗读'}
                >
                  {isSpeaking ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
