import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const getReviews = async (req, res) => {
  try {
    const { productId, status } = req.query;
    let filter = {};
    if (productId) filter.productId = productId;
    if (status) filter.status = status;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(reviews.map((r) => ({ ...r, id: r.id || String(r._id) })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, productName, customerName, customerEmail, rating, title, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ message: "Product ID, customer name, rating, and comment are required" });
    }

    const id = `rev-${Date.now()}`;
    const newReview = await Review.create({
      id,
      productId: String(productId),
      productName: productName || "",
      customerName,
      customerEmail: customerEmail || "",
      rating: Number(rating),
      title: title || "",
      comment,
      status: "Approved",
      isVerifiedBuyer: true,
      date: new Date(),
    });

    // Update product rating and reviews count
    try {
      const allProductReviews = await Review.find({ productId, status: "Approved" });
      const totalReviews = allProductReviews.length;
      const avgRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
      await Product.findOneAndUpdate(
        { $or: [{ id: productId }, { slug: productId.toLowerCase() }] },
        { rating: Number(avgRating.toFixed(2)), reviewsCount: totalReviews }
      );
    } catch (e) {
      console.warn("Product review aggregation warning:", e.message);
    }

    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = await Review.findOne({
      $or: [{ id }, ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])],
    });
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.status = status;
    await review.save();
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findOneAndDelete({
      $or: [{ id }, ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])],
    });
    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

