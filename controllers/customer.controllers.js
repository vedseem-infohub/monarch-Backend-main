import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const getCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).sort({ createdAt: -1 }).lean();

    // Enrich with actual order metrics
    const customersWithOrders = await Promise.all(
      users.map(async (u) => {
        const orders = await Order.find({
          $or: [
            { userId: u._id },
            { "customer.email": u.email },
            { customerEmail: u.email },
          ],
        }).lean();

        const totalOrders = orders.length;
        const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const firstOrder = orders.length > 0 ? orders[orders.length - 1].createdAt : u.createdAt;
        const lastOrder = orders.length > 0 ? orders[0].createdAt : u.createdAt;

        const addresses = [];
        if (u.address) {
          addresses.push({
            name: u.name,
            addressLine1: u.address,
            city: u.city || "Mumbai",
            state: u.state || "Maharashtra",
            postalCode: u.pincode || "400001",
            country: "India",
            phone: u.phone || "",
          });
        }

        orders.forEach((o) => {
          if (o.shippingAddress?.addressLine1 && !addresses.some((a) => a.addressLine1 === o.shippingAddress.addressLine1)) {
            addresses.push(o.shippingAddress);
          }
        });

        return {
          id: String(u._id),
          name: u.name,
          email: u.email,
          phone: u.phone || "—",
          avatar: u.name ? u.name.charAt(0).toUpperCase() : "P",
          totalSpend,
          totalOrders,
          firstOrderDate: firstOrder ? firstOrder.toISOString().split("T")[0] : "2026-01-01",
          lastOrderDate: lastOrder ? lastOrder.toISOString().split("T")[0] : "2026-10-30",
          tags: u.tags && u.tags.length > 0 ? u.tags : [totalSpend > 500000 ? "Royal Patron" : "VIP"],
          status: u.status || "Active",
          addresses,
          notes: u.notes || [],
        };
      })
    );

    return res.status(200).json(customersWithOrders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: "Customer not found" });

    const orders = await Order.find({
      $or: [{ userId: id }, { "customer.email": user.email }],
    }).lean();

    return res.status(200).json({
      ...user,
      id: String(user._id),
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags, status, notes, phone, name } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Customer not found" });

    if (tags) user.tags = tags;
    if (status) user.status = status;
    if (notes) user.notes = notes;
    if (phone) user.phone = phone;
    if (name) user.name = name;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

