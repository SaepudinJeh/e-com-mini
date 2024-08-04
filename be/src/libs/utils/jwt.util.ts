import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export class JwtUtils {
  static generateToken( {email, role}: { email: string, role: string } ) {
    return jwt.sign({ sub: email, role }, JWT_SECRET, { expiresIn: '1h' });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}