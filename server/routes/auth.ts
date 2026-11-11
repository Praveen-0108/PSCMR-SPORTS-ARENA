import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../store.ts';
import { generateToken, verifyToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response): void => {
  try {
    const { name, email, password, role, department, rollNo, phone } = req.body;

    if (!name || !email || !password || !department) {
      res.status(400).json({ message: 'Name, email, password, and department are required.' });
      return;
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists.' });
      return;
    }

    const newUser = db.createUser({
      name,
      email,
      password,
      role: role || 'student',
      department,
      rollNo,
      phone,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user = db.findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User profile not found.' });
    return;
  }
  res.json({ user });
});

export default router;
