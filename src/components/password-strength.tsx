// src/components/password-strength.tsx
import { useState, useEffect } from "react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback("");
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    // Normalize to 0-4 range
    score = Math.min(4, score);
    setStrength(score);
    
    // Set feedback based on score
    switch (score) {
      case 0:
        setFeedback("Very weak");
        break;
      case 1:
        setFeedback("Weak");
        break;
      case 2:
        setFeedback("Medium");
        break;
      case 3:
        setFeedback("Strong");
        break;
      case 4:
        setFeedback("Very strong");
        break;
    }
  }, [password]);
  
  // Calculate color based on strength
  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="space-y-1 mt-1">
      <div className="flex h-1.5 w-full gap-1">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`h-full w-1/4 rounded-full transition-colors ${i < strength ? getColor() : "bg-gray-200"}`} 
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">{feedback}</p>
    </div>
  );
}