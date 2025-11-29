import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';




function loginController(req, res) {
  // Login logic here
  let { username, password } = req.body;

  let token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  

}

function registerController(req, res) {
  // Registration logic here
    let { username, password, email } = req.body;

}

export default { loginController, registerController };
