import { useState } from 'react';

interface UseAsyncOperationResult<T> {
  isLoading: boolean;
  error: string | null;
  execute: (operation: () => Promise<T>) => Promise<T | null>;
  clearError: () => void;
}

export const useAsyncOperation = <T>(): UseAsyncOperationResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ha ocurrido un error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    execute,
    clearError
  };
};