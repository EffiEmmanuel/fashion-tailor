// @ts-nocheck
import { jwtSign, jwtVerify } from "../helpers/auth.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import UserModel from "../model/User.models.js";

export const createUser = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  // Get all fields from the request body
  const { firstName, lastName, email, password } = req.body;

  //   Validate field for empty strings / null values
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(409)
      .json({ message: "Please fill in the missing fields!" });
  }

  console.log("Before try-catch");

  try {
    // Check if any user with the provided email already exists
    let userExistsWithEmail = await UserModel.findOne({ email });
    if (userExistsWithEmail) {
      return res.status(409).json({
        message: `An account with email (${email}) already exists`,
      });
    }

    // If the user does not exist, hash the password
    const hashedPassword = hashPassword(password);
    console.log("After hash password:", hashedPassword);

    // Create a new user
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log("After create user:", user);

    // Save the user to the database
    await user.save();

    // Return a success message with the new user created
    return res.status(201).json({
      message: "Your account has been created successufully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error,
    });
  }
};

export const getUsers = async (req, res) => {
  console.log("OVER HERE");
  try {
    // Query database for all users
    const users = await UserModel.find().populate("projects");
    console.log("DOWN HERE");
    // Return success message with all users
    res.status(200).json({ message: "Fetched all users", data: users });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      data: null,
    });
  }
};

export const getUserById = async (req, res) => {
  // Get user id from request params
  const { userId } = req.params;

  //   Validate field for empty strings / null values
  if (!userId) {
    return res.status(409).json({
      message: "A user id must be provided to perform this operation.",
    });
  }

  try {
    // Query database for all users
    const user = await UserModel.findById(userId).populate({
      path: "cart",
      options: {
        sort: { createdAt: -1 },
      },
    });

    //   Validate field for empty strings / null values
    if (!user) {
      return req.status(404).json({
        message: `User with id (${userId}) does not exist.`,
      });
    }

    // Return success message with all users
    res.status(200).json({ message: "Fetched user", data: user });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getUserByEmail = async (req, res) => {
  // Get user email from request params
  const { userEmail } = req.params;

  //   Validate field for empty strings / null values
  if (!userEmail) {
    return res.status(409).json({
      message: "A user email must be provided to perform this operation.",
    });
  }

  try {
    // Query database for all users
    const user = await UserModel.findOne({ email: userEmail }).populate(
      "projects"
    );

    //   Validate field for empty strings / null values
    if (!user) {
      return req.status(404).json({
        message: `User with email (${userEmail}) does not exist.`,
      });
    }

    // Return success message with all users
    res.status(200).json({ message: "Fetched user", data: user });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      data: null,
    });
  }
};

export const updateUser = async (req, res) => {
  // Get user id from the request params
  const { userId } = req.params;

  //   Validate field for empty strings / null values
  if (!userId) {
    return res.status(409).json({
      message: "A user id must be provided to perform this operation.",
    });
  }

  try {
    // Check if any user with the provided user id exists
    let user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...req.body }
    );
    if (!user) {
      return res.status(404).json({
        message: `Invalid operation. This user does not exist!`,
      });
    }

    let updatedUser = await UserModel.findOne({ _id: userId });

    // Return a success message with the new user created
    res.status(201).json({
      message: "Your details have been updated successufully!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      data: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  // Get user id from the request params
  const { userId } = req.params;

  //   Validate field for empty strings / null values
  if (!userId) {
    return res.status(409).json({
      message: "A user id must be provided to perform this operation.",
    });
  }

  try {
    // Check if any user with the provided email already exists
    let user = await UserModel.findOneAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "Invalid user id provided. This user does not exist.",
      });
    }

    // Return a success message
    res.status(201).json({
      message: "User account deleted successufully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      data: null,
    });
  }
};

export const loginUser = async (req, res) => {
  // Get login credentials
  const { email, password } = req.body;

  //   Validate field for empty strings / null values
  if (!email || !password) {
    return res.status(409).json({
      message: "Please fill in the missing fields.",
    });
  }

  console.log("OVER HERE:", req.body);
  try {
    const userExists = await UserModel.findOne({ email }).populate('cart');
    console.log("OVER HERE - USER:", userExists);
    if (!userExists) {
      return res
        .status(404)
        .json({ message: `No account with email (${email}) exists.` });
    }

    const isPasswordCorrect = comparePassword(password, userExists.password);

    if (!isPasswordCorrect) {
      return res
        .status(409)
        .json({ message: "Invalid email or password provided." });
    }

    console.log("DOWN HERE");

    // TO-DO: Send OTP to email
    const token = await jwtSign({ userExists });
    console.log("AFTER JWT SIGN");

    res
      .status(200)
      .json({ message: "Log in successful!", data: token, user: userExists });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(409).json({ message: "A token must be provided." });
  }

  const isValid = jwtVerify(token);
  console.log("ISVALID:", isValid);
  if (Math.floor(new Date().getTime() / 1000) >= isValid.exp * 100) {
    return res.status(403).json({ message: "Session expired! Please log in." });
  } else {
    return res
      .status(200)
      .json({ message: "Token still valid.", data: isValid.userExists });
  }
};

export const addProductToCart = async (req, res) => {
  // Get product id and user id from req params
  const { productId, userId } = req.params;

  console.log('REQ.PARAMS:::', req.params)
  if (!productId || !userId)
    return res
      .status(404)
      .json({ message: "Both a product id and user id must be provided." });

  try {
    const user = await UserModel.findOne({ _id: userId });
    console.log("USER:", user);
    // const isProductInCart = user.cart.filter((cart) => {
    //   return cart.email === email;
    // });
    // if (stakeholder) {
    //   return res.status(403).json({
    //     message:
    //       "Invalid action. Stakeholder has already been added to project.",
    //   });
    // }

    // project.stakeholders.push(email);

    // await project.save();

    // res.status(201).json({
    //   message: "Stakeholder has been added to the project",
    //   data: project,
    // });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error,
    });
  }
};

export const likedProduct = async (req, res) => {
  // Get product id and user id from req params
  const { productId, userId } = req.params;
  console.log('I AM HERE')
  if (!productId || !userId)
    return res
      .status(404)
      .json({ message: "Both a product id and user id must be provided." });

  try {
    const user = await (
      await UserModel.findOne({ _id: userId })
    ).populate("likedProducts");
    console.log("USER:", user);
    const isProductLiked = user.likedProducts.filter((likedProduct) => {
      return likedProduct._id === _id;
    });

    if (isProductLiked) {
      return res.status(403).json({
        message: "Product is already in your wishlist.",
      });
    }

    isProductLiked.likedProducts.push(productId);

    await isProductLiked.save();

    res.status(201).json({
      message: "Product has been added to your wishlist!",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};
