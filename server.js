const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine + body parsing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

// In-memory "database" (for demo only)
const users = [];

// ---------- Validation rules (all enforced on the SERVER) ----------
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name can contain only letters and spaces'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail()
    .custom((value) => {
      if (users.some((u) => u.email === value)) {
        throw new Error('This email is already registered');
      }
      return true;
    }),

  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 18, max: 100 }).withMessage('Age must be a number between 18 and 100'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password needs at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password needs at least one lowercase letter')
    .matches(/\d/).withMessage('Password needs at least one digit')
    .matches(/[^A-Za-z0-9]/).withMessage('Password needs at least one special character'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.render('form', { errors: {}, values: {} });
});

app.post('/register', registerRules, (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Map errors by field: { email: 'msg', ... } (first error per field)
    const errors = result.mapped();
    const values = { ...req.body };
    delete values.password;
    delete values.confirmPassword;
    return res.status(400).render('form', { errors, values });
  }

  const { name, email, age, phone } = req.body;
  users.push({ name, email, age, phone });
  res.render('success', { name, email });
});

// Optional: view registered users (demo)
app.get('/users', (req, res) => res.json(users));

// 404 handler
app.use((req, res) => res.status(404).send('404 - Page not found'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
