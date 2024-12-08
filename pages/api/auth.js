import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  try {
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
      
      // Set session cookie
      res.setHeader('Set-Cookie', serialize('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600 // 1 hour
      }));

      return res.status(200).json({ authenticated: true });
    }

    return res.status(401).end();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).end();
  }
}