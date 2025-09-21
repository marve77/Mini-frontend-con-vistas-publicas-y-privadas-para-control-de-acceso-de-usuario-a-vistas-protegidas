import { useState } from 'react';

interface UseFormState<T> {
  values: T;
  setValue: (field: keyof T, value: any) => void;
  setValues: (newValues: Partial<T>) => void;
  resetForm: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const useForm = <T extends Record<string, any>>(initialValues: T): UseFormState<T> => {
  const [values, setFormValues] = useState<T>(initialValues);

  const setValue = (field: keyof T, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setValues = (newValues: Partial<T>) => {
    setFormValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  const resetForm = () => {
    setFormValues(initialValues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof T, value);
  };

  return {
    values,
    setValue,
    setValues,
    resetForm,
    handleChange
  };
};