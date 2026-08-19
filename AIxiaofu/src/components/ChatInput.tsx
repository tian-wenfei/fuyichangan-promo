import { useState, KeyboardEvent, useCallback, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../utils/speech';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { startListening, stopListening: stopRecognition } = useSpeechRecognition();
  const stopListeningRef = useRef<(() => void) | null>(null);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);

  const handleSend = useCallback(() => {
    const message = inputValue.trim();
    if (message && !disabled) {
      onSend(message);
      setInputValue('');
    }
  }, [inputValue, disabled, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      // 停止语音监听
      stopRecognition();
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setErrorMessage('');

    stopListeningRef.current = startListening(
      (text) => {
        setInputValue(text);
      },
      (error) => {
        setErrorMessage(error);
        setIsListening(false);
        stopListeningRef.current = null;
        setTimeout(() => setErrorMessage(''), 5000);
      },
      () => {
        setIsListening(false);
        stopListeningRef.current = null;
      }
    );
  }, [isListening, startListening, stopRecognition]);

  return (
    <div className="bg-white border-t border-teal-100/50">
      {errorMessage && (
        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-end gap-3 p-4">
        {/* 语音输入按钮 */}
        <button
          onClick={handleVoiceInput}
          disabled={disabled}
          className={`voice-btn ${isListening ? 'voice-btn-active' : disabled ? 'voice-btn-disabled' : 'voice-btn-idle'}`}
          title={isListening ? '点击停止录音' : '点击开始语音输入'}
        >
          {isListening ? (
            <div className="mic-icon-wrapper">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 19c-2.76 0-5-2.24-5-5V7c0-2.76 2.24-5 5-5s5 2.24 5 5v7c0 2.76-2.24 5-5 5z" />
              </svg>
              <span className="mic-pulse" />
            </div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* 输入框 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={isListening ? '正在倾听...' : '请输入您的问题...'}
            className="search-input"
          />
        </div>

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className={`send-icon-btn ${disabled || !inputValue.trim() ? 'send-icon-btn-disabled' : 'send-icon-btn-active'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
