// @ts-nocheck
import { jwtSign, jwtVerify } from "../helpers/auth.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import ProductModel from "../model/Product.model.js";
import TailorModel from "../model/Tailor.model.js";

export const createTailor = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  // Get all fields from the request body
  const {
    firstName,
    lastName,
    email,
    telephoneNumber,
    password,
    bio,
    profileImage,
  } = req.body;

  //   Validate field for empty strings / null values
  if (
    !firstName ||
    !lastName ||
    !email ||
    !telephoneNumber ||
    !password ||
    !profileImage ||
    !bio
  ) {
    return res
      .status(409)
      .json({ message: "Please fill in the missing fields!" });
  }

  try {
    // Check if any tailor with the provided email already exists
    let tailorExists = await TailorModel.findOne({ email });
    if (tailorExists) {
      return res.status(409).json({
        message: `An account with email (${email}) already exists`,
      });
    }

    // If the user does not exist, hash the password
    const hashedPassword = hashPassword(password);
    console.log("After hash password:", hashedPassword);

    // Create a new product
    const tailor = new TailorModel({
      firstName,
      lastName,
      email,
      telephoneNumber,
      password: hashedPassword,
      bio,
      profileImage,
    });

    // Save the user to the database
    await tailor.save();

    // Return a success message with the new user created
    return res.status(201).json({
      message: "Your account has been created successufully!",
      data: tailor,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getTailors = async (req, res) => {
  try {
    // Query database for all tailors
    const tailors = await TailorModel.find().populate({
      path: "products",
      sort: {
        createdAt: -1,
      },
    });

    // Return success message with all tailors
    res.status(200).json({ message: "Fetched all tailors", data: tailors });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getTailorById = async (req, res) => {
  // Get tailor id from request params
  const { tailorId } = req.params;

  console.log("TAILOR ID:::", tailorId);

  //   Validate field for empty strings / null values
  if (!tailorId) {
    return res.status(409).json({
      message: "A tailor id must be provided to perform this operation.",
    });
  }

  try {
    // Query database for all tailors
    const tailor = await TailorModel.findOne({ _id: tailorId }).populate({
      path: "products",
      options: {
        sort: { createdAt: -1 },
      },
    });

    //   Validate field for empty strings / null values
    if (!tailor) {
      return res.status(404).json({
        message: `Tailor with id (${tailorId}) does not exist.`,
      });
    }

    // Return success message with all tailors
    res.status(200).json({ message: "Fetched tailor", data: tailor });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getTailorByEmail = async (req, res) => {
  // Get tailor email from request params
  const { tailorEmail } = req.params;

  //   Validate field for empty strings / null values
  if (!tailorEmail) {
    return res.status(409).json({
      message: "A tailor email must be provided to perform this operation.",
    });
  }

  try {
    // Query database for tailor with the provided email
    const tailor = await TailorModel.findOne({ email: tailorEmail }).populate({
      path: "products",
      options: {
        sort: { createdAt: -1 },
      },
    });

    //   Validate field for empty strings / null values
    if (!tailor) {
      return res.status(404).json({
        message: `Tailor with email (${tailorEmail}) does not exist.`,
      });
    }

    // Return success message with tailor
    res.status(200).json({ message: "Fetched tailor", data: tailor });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getTailorProducts = async (req, res) => {
  // Get tailor id from request params
  const { tailorId } = req.params;

  console.log("HIIIIIIIIIIII:", tailorId);

  //   Validate field for empty strings / null values
  if (!tailorId) {
    return res.status(409).json({
      message: "A tailor id must be provided to perform this operation.",
    });
  }

  try {
    console.log("HELLOOOOOO");
    // Query database for tailor with the provided id
    const products = await ProductModel.find({ tailor: tailorId });
    console.log("HIIIIIIIIIIII:", products);

    // Return success message with products
    res.status(200).json({ message: "Fetched products", data: products });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const updateTailor = async (req, res) => {
  // Get tailor id from the request params
  const { tailorId } = req.params;

  console.log("OVER HERE");

  //   Validate field for empty strings / null values
  if (!tailorId) {
    return res.status(409).json({
      message: "A tailor id must be provided to perform this operation.",
    });
  }

  console.log("OVER HERE 2");
  try {
    // Check if any tailor with the provided tailor id exists
    let tailor = await TailorModel.findOneAndUpdate(
      { _id: tailorId },
      { ...req.body }
    );
    console.log("OVER HERE 3");
    if (!tailor) {
      return res.status(404).json({
        message: `Invalid operation. This tailor does not exist!`,
      });
    }

    let updatedTailor = await TailorModel.findOne({ _id: tailorId });

    // Return a success message with the updated tailor
    res.status(201).json({
      message: "Your details have been updated successufully!",
      data: updatedTailor,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const deleteTailor = async (req, res) => {
  // Get tailor id from the request params
  const { tailorId } = req.params;

  //   Validate field for empty strings / null values
  if (!tailorId) {
    return res.status(409).json({
      message: "A tailor id must be provided to perform this operation.",
    });
  }

  try {
    // Check if any tailor with the provided id exists
    let tailor = await TailorModel.findOneAndDelete({ _id: tailorId });
    if (!tailor) {
      return res.status(404).json({
        message: "Invalid tailor id provided. This tailor does not exist.",
      });
    }

    // Return a success message
    res.status(201).json({
      message: "Tailor account deleted successufully!",
      data: tailor,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error,
    });
  }
};

export const loginTailor = async (req, res) => {
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
    const tailorExists = await TailorModel.findOne({ email });
    console.log("OVER HERE - USER:", tailorExists);
    if (!tailorExists) {
      return res
        .status(404)
        .json({ message: `No account with email (${email}) exists.` });
    }

    const isPasswordCorrect = comparePassword(password, tailorExists.password);

    if (!isPasswordCorrect) {
      return res
        .status(403)
        .json({ message: "Invalid email or password provided." });
    }

    console.log("DOWN HERE");

    // TO-DO: Send OTP to email
    const token = await jwtSign({ tailorExists });
    console.log("AFTER JWT SIGN");

    res.status(200).json({ message: "Log in successful!", data: token });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error,
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
      .json({ message: "Token still valid.", data: isValid.tailorExists });
  }
};

// export const getStatistics = async (req, res) => {
//   const
//   try {
//     const products = await ProductModel.find({ tailor: tailorId }).count();
//     const engineers = await EngineerModel.find().count();
//     const projects = await ProjectModel.find().count();

//     const data = {
//       products,
//       engineers,
//       projects,
//     };

//     return res
//       .status(200)
//       .json({ message: "Statistics fetched successufully!", data });
//   } catch (error) {
//     res.status(500).json({
//       message:
//         "An error occured while we processed your request, please tryed again",
//       error: error,
//     });
//   }
// };
