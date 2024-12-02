const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// register a new user
const registerNewUser = async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    const user = await new User({
      name,
      email,
      mobileNumber,
      password: hashPassword,
    });
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "User Registeration Success", user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while registering user" });
  }
};

// authenticate Registered User
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "user not found , please register first" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "password is wrong" });

   const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1D" }
    );

    res.status(201).json({"message" : "login success", user : {name : user.name , userId : user._id , token}})
  } catch (error) {}
};
module.exports = { registerNewUser,authenticateUser };
