import Cart from "../models/cart.model.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: `Get cart error ${error.message}` });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, name, price, quantity, imageUrl, image, color, size, customMeasurements, count = 1 } = req.body;

    if (!productId || !name || price === undefined) {
      return res.status(400).json({ message: "Missing cart item data (productId, name, price required)" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemColor = color || "";
    const itemSize = size || String(quantity || "Standard");

    const existingItem = cart.items.find(
      (item) => String(item.productId) === String(productId) && item.color === itemColor && item.size === itemSize
    );

    if (existingItem) {
      existingItem.count += count;
      if (imageUrl || image) {
        existingItem.imageUrl = imageUrl || image;
        existingItem.image = imageUrl || image;
      }
      if (customMeasurements) {
        existingItem.customMeasurements = customMeasurements;
      }
    } else {
      cart.items.push({
        productId: String(productId),
        name,
        price: Number(price),
        quantity: quantity || 1,
        count,
        imageUrl: imageUrl || image || "",
        image: image || imageUrl || "",
        color: itemColor,
        size: itemSize,
        customMeasurements: customMeasurements || null,
      });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: `Add to cart error ${error.message}` });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity, count, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Missing product identifier" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemColor = color || "";
    const itemSize = size || (quantity ? String(quantity) : "");

    const newCount = count !== undefined ? count : quantity;

    if (newCount <= 0) {
      cart.items = cart.items.filter((item) => {
        if (itemColor && itemSize) {
          return !(String(item.productId) === String(productId) && item.color === itemColor && item.size === itemSize);
        }
        return String(item.productId) !== String(productId);
      });
    } else {
      const item = cart.items.find((item) => {
        if (itemColor && itemSize) {
          return String(item.productId) === String(productId) && item.color === itemColor && item.size === itemSize;
        }
        return String(item.productId) === String(productId);
      });

      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      item.count = newCount;
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: `Update cart error ${error.message}` });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });
    return res.status(200).json(cart || { items: [] });
  } catch (error) {
    return res.status(500).json({ message: `Clear cart error ${error.message}` });
  }
};

export const getAdminAbandonedCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ "items.0": { $exists: true } })
      .populate("userId", "name email phone")
      .sort({ updatedAt: -1 });

    const formatted = carts.map((c) => {
      const user = c.userId || {};
      const totalValue = c.items.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.count) || Number(i.quantity) || 1),
        0
      );
      return {
        id: c._id.toString(),
        cartToken: `cart_${c._id.toString().slice(-8)}`,
        customerId: user._id ? user._id.toString() : "guest",
        customerName: user.name || "Bespoke Patron",
        customerEmail: user.email || "guest@monarch-couture.in",
        customerPhone: user.phone || "+91 98200 44590",
        items: c.items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          variant: i.size ? `${i.size}${i.color ? ` · ${i.color}` : ""}` : i.color || "Custom",
          price: Number(i.price) || 0,
          quantity: Number(i.count) || Number(i.quantity) || 1,
          image: i.imageUrl || i.image || "",
        })),
        totalValue,
        abandonedAt: c.updatedAt ? c.updatedAt.toISOString() : new Date().toISOString(),
        recoveryStatus: "Uncontacted",
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: `Get abandoned carts error: ${error.message}` });
  }
};
