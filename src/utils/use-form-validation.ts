/**
 * Form Validation Hook
 *
 * Reusable form validation logic that can be used across
 * different form components (contact, search, etc.)
 */

// ============================================================================
// Types
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: string) => boolean;
  message?: string;
}

export interface FieldConfig {
  [fieldName: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a single field against its rules
 */
export function validateField(
  value: string,
  rules: ValidationRule
): string | null {
  // Required validation
  if (rules.required && !value.trim()) {
    return rules.message || "This field is required";
  }

  // Skip other validations if field is empty and not required
  if (!value.trim() && !rules.required) {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.trim().length < rules.minLength) {
    return (
      rules.message || `Must be at least ${rules.minLength} characters long`
    );
  }

  // Max length validation
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    return (
      rules.message || `Must be no more than ${rules.maxLength} characters long`
    );
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || "Invalid format";
  }

  // Custom validation function
  if (rules.validate && !rules.validate(value)) {
    return rules.message || "Validation failed";
  }

  return null;
}

/**
 * Validate all fields in a form
 */
export function validateForm<T extends Record<string, any>>(
  values: T,
  config: FieldConfig
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(config)) {
    const value = String(values[field] ?? "");
    const error = validateField(value, rules);

    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// ============================================================================
// Field-Specific Validators
// ============================================================================

/**
 * Email validation
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
}

/**
 * Name validation
 */
export function validateName(name: string): string | null {
  if (!name.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (name.trim().length > 100) {
    return "Name must be less than 100 characters";
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  return null;
}

/**
 * Message validation
 */
export function validateMessage(message: string): string | null {
  if (!message.trim()) {
    return "Message is required";
  }

  if (message.trim().length < 10) {
    return "Message must be at least 10 characters long";
  }

  if (message.trim().length > 1000) {
    return "Message must be less than 1000 characters";
  }

  const wordCount = message.trim().split(/\s+/).length;
  if (wordCount < 3) {
    return "Message must contain at least 3 words";
  }

  return null;
}

// ============================================================================
// Form State Management
// ============================================================================

/**
 * Create initial form state
 */
export function createFormState<T>(): FormState<T> {
  return {
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  };
}

/**
 * Update form state with new values
 */
export function updateFormState<T>(
  state: FormState<T>,
  field: keyof T,
  value: any
): FormState<T> {
  return {
    ...state,
    values: {
      ...state.values,
      [field]: value,
    },
    touched: {
      ...state.touched,
      [field]: true,
    },
  };
}

/**
 * Update form errors
 */
export function updateFormErrors<T>(
  state: FormState<T>,
  errors: Record<string, string>
): FormState<T> {
  return {
    ...state,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Mark form as submitting
 */
export function setSubmitting<T>(
  state: FormState<T>,
  isSubmitting: boolean
): FormState<T> {
  return {
    ...state,
    isSubmitting,
  };
}

// ============================================================================
// Error Display Helpers
// ============================================================================

/**
 * Check if field should show error
 */
export function shouldShowError<T>(
  state: FormState<T>,
  field: string
): boolean {
  return !!(state.touched[field] && state.errors[field]);
}

/**
 * Get error message for field
 */
export function getErrorMessage<T>(
  state: FormState<T>,
  field: string
): string | null {
  return shouldShowError(state, field) ? state.errors[field] || null : null;
}

/**
 * Get first error in form
 */
export function getFirstError<T>(state: FormState<T>): string | null {
  const errorFields = Object.keys(state.errors);
  if (errorFields.length === 0) return null;

  const firstField = errorFields[0];
  return firstField ? state.errors[firstField] || null : null;
}

// ============================================================================
// Form Submission Helpers
// ============================================================================

/**
 * Prepare form data for submission
 */
export function prepareFormData<T>(values: Partial<T>): Record<string, string> {
  const data: Record<string, string> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null) {
      data[key] = String(value).trim();
    }
  }

  return data;
}

/**
 * Reset form to initial state
 */
export function resetForm<T>(): FormState<T> {
  return createFormState<T>();
}

// ============================================================================
// Debounce Utility
// ============================================================================

/**
 * Create debounced validation function
 */
export function createDebouncedValidator(
  delay: number = 300
): (callback: () => void) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (callback: () => void) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback();
      timeoutId = null;
    }, delay);
  };
}

// ============================================================================
// Pre-configured Validation Configs
// ============================================================================

/**
 * Contact form validation config
 */
export const contactFormConfig: FieldConfig = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: "Please enter a valid name",
  },
  email: {
    required: true,
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    validate: (value: string) => value.trim().split(/\s+/).length >= 3,
    message: "Message must be at least 10 characters and 3 words",
  },
};

/**
 * Search form validation config
 */
export const searchFormConfig: FieldConfig = {
  query: {
    required: true,
    minLength: 2,
    maxLength: 200,
    message: "Search query must be between 2 and 200 characters",
  },
};
