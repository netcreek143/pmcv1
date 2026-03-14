import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import multer from "multer";
import prisma from "./src/lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { shiprocketService } from "./src/services/shiprocketService.js";
import { generateInvoice } from "./src/utils/invoiceGenerator.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static('uploads')); // Serve uploaded files

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "CUSTOMER" }
      });
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      if (decoded.role !== 'ADMIN') {
        return res.status(403).json({ error: "Forbidden" });
      }
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  app.post("/api/upload", isAdmin, upload.single('image'), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  app.get("/api/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: String(search) } },
          { description: { contains: String(search) } }
        ];
      }
      
      if (category) {
        where.category = { slug: String(category) };
      }

      const products = await prisma.product.findMany({
        where,
        include: { category: true }
      });
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const { name, slug, description } = req.body;
      const category = await prisma.category.create({
        data: { name, slug, description },
      });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const { name, slug, description } = req.body;
      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: { name, slug, description },
      });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      await prisma.category.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: { slug: req.params.slug },
        include: { category: true }
      });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const { name, slug, description, price, stock, categoryId, images } = req.body;
      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId,
          images: JSON.stringify(images || []),
        },
      });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const { name, slug, description, price, stock, categoryId, images } = req.body;
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: {
          name,
          slug,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId,
          images: JSON.stringify(images || []),
        },
      });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      // Return only necessary info for tracking
      res.json({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/orders/:id/verify-payment", async (req, res) => {
    try {
      const { payment_intent } = req.body;
      const orderId = req.params.id;

      if (!payment_intent) {
        return res.status(400).json({ error: "Missing payment intent" });
      }

      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any,
      });

      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

      if (paymentIntent.status === 'succeeded') {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PROCESSING' }
        });
        return res.json({ success: true, order });
      } else {
        return res.status(400).json({ error: "Payment not successful" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { items, total } = req.body;
      
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any,
      });

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(total) * 100), // Stripe expects amounts in cents
        currency: "inr",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  app.post("/api/create-razorpay-order", async (req, res) => {
    try {
      const { total } = req.body;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const options = {
        amount: Math.round(parseFloat(total) * 100), // Amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Failed to create Razorpay order:", error);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  });

  app.post("/api/verify-razorpay-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Failed to verify Razorpay payment:", error);
      res.status(500).json({ error: "Failed to verify Razorpay payment" });
    }
  });

  app.get("/api/orders/:id/invoice", isAdmin, async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          user: true,
          items: { include: { product: true } }
        }
      });
      if (!order) return res.status(404).json({ error: "Order not found" });
      
      const invoice = generateInvoice(order);
      console.log(`Generated invoice for order ${order.id}, size: ${invoice.byteLength} bytes`);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.id}.pdf`);
      res.setHeader('Content-Length', invoice.byteLength);
      res.send(Buffer.from(invoice));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { customer, items, total } = req.body;
      
      let userId = '';
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
          userId = decoded.id;
        } catch (err) {
          // Invalid token, ignore and proceed as guest
        }
      }

      if (!userId) {
        // Find or create guest user based on email
        let user = await prisma.user.findUnique({ where: { email: customer.email } });
        if (!user) {
          const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
          user = await prisma.user.create({
            data: {
              name: `${customer.firstName} ${customer.lastName}`.trim(),
              email: customer.email,
              password: randomPassword,
              role: "CUSTOMER"
            }
          });
        }
        userId = user.id;
      }
      
      const order = await prisma.order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount: parseFloat(total),
          shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}`,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: parseFloat(item.price)
            }))
          }
        },
        include: {
          items: { include: { product: true } }
        }
      });
      
      // Create Shiprocket order
      try {
        const shiprocketOrder = await shiprocketService.createOrder({
          order_id: order.id,
          order_date: new Date().toISOString(),
          pickup_location: "Primary",
          billing_customer_name: customer.firstName,
          billing_last_name: customer.lastName,
          billing_address: customer.address,
          billing_city: customer.city,
          billing_state: customer.state,
          billing_country: "India",
          billing_email: customer.email,
          billing_phone: customer.phone,
          billing_pincode: customer.pincode,
          shipping_is_billing: true,
          order_items: order.items.map((item: any) => ({
            name: item.product.name,
            sku: item.productId,
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: "Prepaid",
          sub_total: order.totalAmount,
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { shipmentId: String(shiprocketOrder.shipment_id) }
        });
      } catch (error) {
        console.error("Failed to create Shiprocket shipment:", error);
      }
      
      res.json(order);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/my-orders", authenticate, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch my orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders", isAdmin, async (req, res) => {
    try {
      const { limit } = req.query;
      const orders = await prisma.order.findMany({
        take: limit ? parseInt(String(limit)) : undefined,
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      res.status(500).json({ error: "Failed to fetch orders", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
      });
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/customers", isAdmin, async (req, res) => {
    try {
      const customers = await prisma.user.findMany({
        where: {
          role: 'CUSTOMER'
        },
        include: {
          orders: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Map to include order stats
      const customerStats = customers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        createdAt: c.createdAt,
        totalOrders: c.orders.length,
        totalSpent: c.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      }));
      
      res.json(customerStats);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/orders/:id/tracking", async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
      });
      if (!order || !order.shipmentId) {
        return res.status(404).json({ message: 'Order or shipment not found' });
      }
      const tracking = await shiprocketService.getTracking(order.shipmentId);
      res.json(tracking);
    } catch (error) {
      console.error("Failed to fetch tracking details:", error);
      res.status(500).json({ message: 'Error fetching tracking details' });
    }
  });

  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
      const [totalOrders, totalProducts, totalCustomers, orders] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.findMany({ select: { totalAmount: true } })
      ]);
      
      const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      res.json({
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers
      });
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/settings", isAdmin, async (req, res) => {
    try {
      const settings = await prisma.setting.findMany();
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      res.json(settingsMap);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", isAdmin, async (req, res) => {
    try {
      const settings = req.body;
      
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      }
      
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

