// src/app/lib/authValidation.ts
export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  
  // Check for complexity requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
    return "Password must include uppercase, lowercase, number, and special character";
  }
  
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  
  // Enhanced email regex that checks for valid format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone number is required";
  
  // Basic phone validation (allows +, spaces, and digits)
  // Requires at least 10 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return "Phone number must have at least 10 digits";
  }
  
  // const phoneRegex = /^(\+?\d{1,3})?[\s-]?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{4})$/;
    const phoneRegex = /^(\+?\d{0,3})?[-\s]?[\(]?[\d]{1,4}[\)]?[-\s]?[\d\s]{5,15}$/;

  if (!phoneRegex.test(phone)) {
    return "Please enter a valid phone number (e.g., +91 9876543210)";
  }
  
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value) return `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required`;
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name is too short";
  
  // Check for valid name (allows letters, spaces, hyphens, and apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return "Name contains invalid characters";
  }
  
  return null;
}