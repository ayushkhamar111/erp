const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  try {
    const { username, password, repeatPassword } = req.body;

    if (!username || !password || !repeatPassword) {
      return res.status(400).json({
        status: false,
        message: 'Username, password, and repeat password are required',
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        status: false,
        message: 'Passwords do not match',
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    return res.json({
      status: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({status:false, message: 'User not found' });

  if(user.status != 1) return res.status(400).json({status:false, message: 'User Is Inactive' });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({status:false, message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ status:true,message: 'Login Ssuccessful',token });
}

module.exports = {
  registerUser,login
};
