import { useRef, useCallback } from 'react';

// 语音识别结果回调类型
export type VoiceResultCallback = (text: string, isFinal: boolean) => void;
export type VoiceErrorCallback = (error: string) => void;
export type VoiceEndCallback = () => void;

// 语音识别 Hook
export function useSpeechRecognition() {
  const recognitionRef = useRef<any>(null);
  const instanceIdRef = useRef(0);
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  const isSupported = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        instanceIdRef.current += 1;
        retryCountRef.current = 0;
        recognition.stop();
      } catch (e) {
        // 忽略已停止时的错误
      }
    }
    recognitionRef.current = null;
  }, []);

  const createRecognition = useCallback((
    onResult: VoiceResultCallback,
    onError?: VoiceErrorCallback,
    onEnd?: VoiceEndCallback
  ) => {
    const win = window as unknown as Record<string, new () => any>;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      onError?.('语音识别服务不可用，请检查浏览器版本');
      return false;
    }

    const recognition = new SpeechRecognitionClass();
    const currentInstanceId = instanceIdRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
    recognition.maxAlternatives = 1;

    // 超时保护
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    const clearSilenceTimer = () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    };
    const resetSilenceTimer = () => {
      clearSilenceTimer();
      silenceTimer = setTimeout(() => {
        if (instanceIdRef.current === currentInstanceId) {
          stopListening();
          onEnd?.();
        }
      }, 30000);
    };

    recognition.onresult = (event: any) => {
      if (instanceIdRef.current !== currentInstanceId) return;
      resetSilenceTimer();

      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const combinedText = finalTranscript + interimTranscript;
      const hasFinal = finalTranscript.length > 0;
      onResult(combinedText, hasFinal);
    };

    recognition.onerror = (event: any) => {
      if (instanceIdRef.current !== currentInstanceId) return;
      clearSilenceTimer();

      if (event.error === 'aborted') {
        return;
      }

      // network 错误自动重试
      if (event.error === 'network' && retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        const delay = retryCountRef.current * 1000; // 1s, 2s 退避
        console.log(`语音识别网络错误，${delay / 1000}s 后第 ${retryCountRef.current} 次重试...`);
        setTimeout(() => {
          // 确保当前实例仍有效
          if (instanceIdRef.current === currentInstanceId) {
            try {
              recognition.start();
            } catch (e) {
              onError?.('语音识别重试失败，请改用文字输入');
            }
          }
        }, delay);
        return; // 不报错，先重试
      }

      recognitionRef.current = null;

      let errorMessage = '语音识别失败';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = '请在浏览器设置中允许麦克风权限';
          break;
        case 'no-speech':
          errorMessage = '未检测到语音输入，请靠近麦克风说话';
          break;
        case 'audio-capture':
          errorMessage = '无法访问麦克风，请检查设备连接';
          break;
        case 'network':
          errorMessage = '语音服务网络连接失败（已重试），建议使用文字输入';
          break;
        case 'not-supported':
          errorMessage = '您的浏览器不支持语音识别';
          break;
        default:
          errorMessage = `语音识别失败: ${event.error}`;
      }
      onError?.(errorMessage);
    };

    recognition.onend = () => {
      if (instanceIdRef.current !== currentInstanceId) return;
      clearSilenceTimer();
      recognitionRef.current = null;
      onEnd?.();
    };

    recognition.onstart = () => {
      if (instanceIdRef.current !== currentInstanceId) return;
      retryCountRef.current = 0; // 成功启动，重置重试计数
      resetSilenceTimer();
    };

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  }, [stopListening]);

  const startListening = useCallback((
    onResult: VoiceResultCallback,
    onError?: VoiceErrorCallback,
    onEnd?: VoiceEndCallback
  ) => {
    // 先停止之前的识别
    stopListening();

    if (!isSupported()) {
      onError?.('您的浏览器不支持语音识别功能，请使用 Chrome、Edge 或 Safari 浏览器');
      return () => {};
    }

    try {
      createRecognition(onResult, onError, onEnd);
    } catch (error) {
      recognitionRef.current = null;
      onError?.('无法启动语音识别，请检查麦克风权限');
    }

    return stopListening;
  }, [isSupported, stopListening, createRecognition]);

  return { startListening, stopListening, isSupported };
}

// 语音合成 Hook
export function useSpeechSynthesis() {
  const isSpeakingRef = useRef(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const isSupported = useCallback(() => {
    return 'speechSynthesis' in window;
  }, []);

  const stopSpeaking = useCallback(() => {
    cancelRef.current?.();
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
  }, []);

  // 甜美女声优先级列表（从高到低）
  const SWEET_VOICE_KEYWORDS = [
    'Xiaoxiao',    // 微软晓晓 - 活泼甜美少女 ⭐
    'Xiaoyi',      // 微软晓伊 - 温柔年轻女声
    'Yaoyao',      // 微软瑶瑶 - 年轻女性
    'Xiaobei',     // 微软晓北 - 东北话女声
    'Tingting',    // 微软/苹果婷婷 - 标准女声
    'Meijia',      // 苹果美佳 - 台湾女声
    'Yunyang',     // 微软云扬 - 男声（最后备选）
    'Yunxi',       // 微软云希 - 男声（最后备选）
  ];

  // 清理文本中的 Markdown 格式标记，避免 TTS 朗读 * # ` 等符号
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')   // **粗体** → 粗体
      .replace(/__(.+?)__/g, '$1')        // __粗体__ → 粗体
      .replace(/\*(.+?)\*/g, '$1')        // *斜体* → 斜体
      .replace(/_(.+?)_/g, '$1')          // _斜体_ → 斜体
      .replace(/`(.+?)`/g, '$1')          // `代码` → 代码
      .replace(/~~(.+?)~~/g, '$1')        // ~~删除线~~ → 删除线
      .replace(/[*#_`~]/g, '')            // 清除剩余的孤立标记字符
      .replace(/\s+/g, ' ')               // 合并多余空白
      .trim();
  };

  const speak = useCallback((text: string, onEnd?: () => void) => {
    stopSpeaking();

    if (!isSupported()) {
      console.warn('您的浏览器不支持语音合成功能');
      onEnd?.();
      return () => {};
    }

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    // 甜美参数：语速适中偏快、音调偏高、音量饱满
    utterance.rate = 1.05;
    utterance.pitch = 1.4;
    utterance.volume = 1.0;

    let cancelled = false;

    const setVoice = () => {
      if (cancelled) return;
      const voices = window.speechSynthesis.getVoices();
      const zhVoices = voices.filter(v => v.lang.startsWith('zh'));

      let selectedVoice: SpeechSynthesisVoice | undefined;

      // 1. 优先在线云端甜美语音（音质更自然，表现力更强）
      for (const keyword of SWEET_VOICE_KEYWORDS) {
        selectedVoice = zhVoices.find(v =>
          v.name.includes(keyword) && !v.localService
        );
        if (selectedVoice) {
          console.log('🎤 已选择在线甜美语音:', selectedVoice.name, selectedVoice.localService ? '(本地)' : '(云端)');
          break;
        }
      }

      // 2. 无在线语音时回退到本地甜美语音
      if (!selectedVoice) {
        for (const keyword of SWEET_VOICE_KEYWORDS) {
          selectedVoice = zhVoices.find(v =>
            v.name.includes(keyword) && v.localService
          );
          if (selectedVoice) {
            console.log('🎤 回退使用本地甜美语音:', selectedVoice.name);
            break;
          }
        }
      }

      // 3. 再次回退：任意在线中文语音
      if (!selectedVoice) {
        selectedVoice = zhVoices.find(v => !v.localService);
        if (selectedVoice) {
          console.log('🎤 回退使用在线中文语音:', selectedVoice.name);
        }
      }

      // 4. 最终回退：任意本地中文语音
      if (!selectedVoice) {
        selectedVoice = zhVoices.find(v => v.lang.startsWith('zh-CN'))
                     || zhVoices[0];
        if (selectedVoice) {
          console.log('🎤 回退使用默认中文语音:', selectedVoice.name);
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn('⚠️ 未找到中文语音，使用浏览器默认语音');
      }
    };

    setVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
      onEnd?.();
    };

    utterance.onerror = (event: any) => {
      if (event.error !== 'interrupted') {
        console.error('语音合成失败:', event.error);
      }
      isSpeakingRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
      if (event.error !== 'interrupted' && !cancelled) {
        onEnd?.();
      }
    };

    const cancel = () => {
      cancelled = true;
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
      isSpeakingRef.current = false;
    };

    cancelRef.current = cancel;
    window.speechSynthesis.speak(utterance);

    return cancel;
  }, [isSupported, stopSpeaking]);

  return { speak, stopSpeaking, isSupported, isSpeaking: isSpeakingRef };
}
