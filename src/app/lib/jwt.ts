import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret_key';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
