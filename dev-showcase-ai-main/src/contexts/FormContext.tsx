import React, { createContext, useContext, ReactNode } from "react";
import {
  useFormPersistence,
  useStepPersistence,
} from "@/hooks/useLocalStorage";

// Define the form data structure
export interface ProjectFormData {
  // Project Information
  name: string;
  description: string;
  status: string;
  visibility: string;
  category: string;
  url: string;
  tags: string[];

  // Technology Stack
  technologies: string[];

  // Project Media
  media: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;

  // Metadata
  lastUpdated: string;
  isDraft: boolean;
}

// Define the form context type
interface FormContextType {
  formData: ProjectFormData;
  updateFormData: (updates: Partial<ProjectFormData>) => void;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  isLoading: boolean;
  resetForm: () => void;
  validateStep: (step: string) => boolean;
  getStepCompletion: (step: string) => {
    isComplete: boolean;
    missingFields: string[];
  };
}

// Initial form data
const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "",
  visibility: "",
  category: "",
  url: "",
  tags: [],
  technologies: [],
  media: [],
  lastUpdated: new Date().toISOString(),
  isDraft: false,
};

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Form provider component
interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [formData, updateFormData, isLoading] =
    useFormPersistence(initialFormData);
  const [currentStep, setCurrentStep] = useStepPersistence();

  // Reset form data
  const resetForm = () => {
    updateFormData(initialFormData);
    setCurrentStep("project-info");
  };

  // Validate individual steps
  const validateStep = (step: string): boolean => {
    switch (step) {
      case "project-info":
        return !!(
          formData.name.trim() &&
          formData.description.trim() &&
          formData.tags.length > 0
        );
      case "tech-stack":
        return formData.technologies.length > 0;
      case "project-media":
        return formData.media.length > 0;
      case "actions-help":
        return true; // Always valid
      default:
        return false;
    }
  };

  // Get step completion details
  const getStepCompletion = (
    step: string,
  ): { isComplete: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    switch (step) {
      case "project-info":
        if (!formData.name.trim()) missingFields.push("Project Name");
        if (!formData.description.trim()) missingFields.push("Description");
        if (formData.tags.length === 0) missingFields.push("Tags");
        break;
      case "tech-stack":
        if (formData.technologies.length === 0)
          missingFields.push("Technologies");
        break;
      case "project-media":
        if (formData.media.length === 0) missingFields.push("Media Files");
        break;
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  };

  const contextValue: FormContextType = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    isLoading,
    resetForm,
    validateStep,
    getStepCompletion,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

// Custom hook to use the form context
export function useFormContext(): FormContextType {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
