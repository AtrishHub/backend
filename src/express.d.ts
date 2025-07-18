import 'express';

declare module 'express' {
  interface Request {
    user?: any; // You can replace 'any' with your JWT payload type if you have one
  }
} 