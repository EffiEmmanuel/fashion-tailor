// @ts-nocheck
import ProductModel from "../model/Product.model.js";
import TailorModel from "../model/Tailor.model.js";

export const createProduct = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  // console.log("REQ.BODY:", req.body);
  // Get all fields from the request body
  const {
    productName,
    productDescription,
    price,
    productionDuration,
    image,
    typeOfMaterialNeeded,
  } = req.body;
  const { tailorId } = req.query;

  //   Validate field for empty strings / null values
  if (
    !productName ||
    !productDescription ||
    !price ||
    !productionDuration ||
    !image ||
    !typeOfMaterialNeeded ||
    !tailorId
  ) {
    return res.status(409).json({
      message: "Missing parameters. Please provide all required parameters!",
    });
  }

  try {
    // Check if any user with the provided id already exists
    let tailorExists = await TailorModel.findOne({ _id: tailorId });
    if (!tailorExists) {
      return res.status(404).json({
        message: `No tailor found for the id provided.`,
      });
    }

    // Create a new product
    const product = new ProductModel({
      productName,
      productDescription,
      price,
      image,
      typeOfMaterialNeeded,
      productionDuration,
      tailor: tailorId,
    });

    // Save the product to the database
    await product.save();

    // Add product to tailor model
    tailorExists.products.push(product._id);

    // Save the tailor model
    await tailorExists.save();

    // Return a success message with the new user created
    return res.status(201).json({
      message: "Your product has been created successufully!",
      data: tailorExists,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  console.log("OVER HERE");
  try {
    // Query database for all products
    const prodcts = await ProductModel.find().populate("tailor");
    console.log("DOWN HERE");
    // Return success message with all prodcts
    res.status(200).json({ message: "Fetched all products", data: prodcts });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  // Get user id from request params
  const { productId } = req.params;

  //   Validate field for empty strings / null values
  if (!productId) {
    return res.status(409).json({
      message: "A product id must be provided to perform this operation.",
    });
  }

  try {
    // Query database for product with the id provided
    const product = await ProductModel.findById(productId).populate("tailor");

    //   Validate field for empty strings / null values
    if (!product) {
      return req.status(404).json({
        message: `Product with id (${userId}) does not exist.`,
      });
    }

    // Return success message with fetched product
    res.status(200).json({ message: "Fetched product", data: product });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  // Get user id from the request params
  const { productId, tailorId } = req.params;

  //   Validate field for empty strings / null values
  if (!productId || !tailorId) {
    return res.status(409).json({
      message:
        "Both a product id and tailor id must be provided to perform this operation.",
    });
  }

  try {
    // Check if any product with the provided product id exists
    let product = await ProductModel.findOneAndUpdate(
      { _id: productId, tailor: tailorId },
      { ...req.body }
    );
    if (!product) {
      return res.status(404).json({
        message: `Invalid operation. This product does not exist!`,
      });
    }

    let updatedProduct = await ProductModel.findOne({ _id: productId });

    // Return a success message with the new user created
    res.status(201).json({
      message: "Your product was updated successufully!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  // Get product id and tailor id from the request params
  const { productId, tailorId } = req.params;

  //   Validate field for empty strings / null values
  if (!productId || !tailorId) {
    return res.status(404).json({
      message:
        "Both a user id and product id must be provided to perform this operation.",
    });
  }

  try {
    // Check if any product with the provided id already exists
    let product = await ProductModel.findOneAndDelete({
      _id: productId,
      tailor: tailorId,
    });

    if (!product) {
      return res.status(403).json({
        message:
          "Invalid action. This product does not exist or this product does not belong to you!",
      });
    }

    let updatedProductList = await ProductModel.find({ tailor: tailorId });

    // Return a success message
    res.status(201).json({
      message: "Product deleted successufully!",
      data: updatedProductList,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occured while we processed your request, please try again",
      error: error.message,
    });
  }
};

// export const addProductToCart = async (req, res) => {
//   // Get product id and user id from req params
//   const { productId, userId } = req.params;

//   if (!productId || !userId)
//     return res
//       .status(404)
//       .json({ message: "Both a product id and user id must be provided." });

//   try {
//     const user = await UserModel.findOne({ _id: userId });
//     console.log("USER:", user);
//     // const isProductInCart = user.cart.filter((cart) => {
//     //   return cart.email === email;
//     // });
//     // if (stakeholder) {
//     //   return res.status(403).json({
//     //     message:
//     //       "Invalid action. Stakeholder has already been added to project.",
//     //   });
//     // }

//     // project.stakeholders.push(email);

//     // await project.save();

//     // res.status(201).json({
//     //   message: "Stakeholder has been added to the project",
//     //   data: project,
//     // });
//   } catch (error) {
//     res.status(500).json({
//       message:
//         "An error occured while we processed your request, please try again",
//       error: error,
//     });
//   }
// };

export const searchProducts = async (req, res) => {
  const { searchQuery } = req.query;
  console.log('HELLOOOOOOOOO')
  try {
    const products = await ProductModel.find().populate('tailor').sort({ creaetedAt: -1 });
    console.log('PRODUCTS:', products)
    if (!products) {
      return res
        .status(404)
        .json({ message: "There are no products on our web app yet." });
    }

    const searchMatch = products.filter((product) => {
      return product.productName.includes(searchQuery);
    });

    console.log('SEARCHMATCH:', searchMatch)

    return res
      .status(200)
      .json({ message: "Search results", data: searchMatch });
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          "An error occured while we processed your request. Please, try again later.",
        error: error.message,
      });
  }
};
