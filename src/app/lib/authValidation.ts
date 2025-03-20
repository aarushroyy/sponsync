export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return null;
  };
  
  export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
  };
  
  export const validateRequired = (value: string, field: string): string | null => {
    if (!value) return `${field} is required`;
    return null;
  };