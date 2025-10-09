import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for localStorage with debouncing
 * Automatically saves data to localStorage with a configurable delay
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500
): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save function
  const setValue = useCallback((value: T) => {
    setStoredValue(value);
    setIsLoading(true);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        setIsLoading(false);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        setIsLoading(false);
      }
    }, debounceMs);
  }, [key, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return [storedValue, setValue, isLoading];
}

/**
 * Hook for managing form data persistence
 */
export function useFormPersistence<T extends Record<string, any>>(
  initialData: T,
  formKey: string = 'showwork-form-data'
): [T, (updates: Partial<T>) => void, boolean] {
  const [formData, setFormData, isLoading] = useLocalStorage(formKey, initialData);

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, [setFormData]);

  return [formData, updateFormData, isLoading];
}

/**
 * Hook for managing current step persistence
 */
export function useStepPersistence(
  initialStep: string = 'project-info',
  stepKey: string = 'showwork-current-step'
): [string, (step: string) => void, boolean] {
  const [currentStep, setCurrentStep, isLoading] = useLocalStorage(stepKey, initialStep, 100); // Faster save for step changes
  
  return [currentStep, setCurrentStep, isLoading];
}
