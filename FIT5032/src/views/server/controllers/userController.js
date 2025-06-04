import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  console.log("Received POST request on /api/login"); //test
  const { emailAddress, password } = req.body;

  try {
    const user = await User.findOne({ email: emailAddress });
    if (!user) {
      return res.status(401).json({ message: "Invalid email address", status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("Login successful");  // test
      res.status(200).json({ message: "Login success", status: 200 });
    } else {
      console.log("Invalid password");  // test
      res.status(401).json({ message: "Invalid password", status: 401 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", status: 500 });
  }
};

export default { login }; 
