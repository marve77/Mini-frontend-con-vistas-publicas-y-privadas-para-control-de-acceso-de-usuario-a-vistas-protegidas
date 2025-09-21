import { useState, useEffect } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setMessage('');
        setType(null);
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showToast = (text: string, toastType: 'success' | 'error' = 'success') => {
    setMessage(text);
    setType(toastType);
  };

  const hideToast = () => {
    setMessage('');
    setType(null);
    setIsVisible(false);
  };

  return {
    message,
    type,
    isVisible,
    showToast,
    hideToast
  };
};