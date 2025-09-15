import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';

const JWT_EXPIRATION = '1d';

export const jwttoken = {
 sign: (payload) => {
  try {
   return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  }
  catch (e) {
   logger.error("Failed to authenticate token", error);
   throw new Error("Failed to authenticate token");
  }
 },
 verify: (token) => {
  try {
   return jwt.verify(token, JWT_SECRET);
  }
  catch (e) {
   logger.error("Failed to authenticate token", error);
   throw new Error("Failed to authenticate token");

  }
 }
};
