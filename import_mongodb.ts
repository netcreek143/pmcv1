import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  console.log('Importing data into MongoDB...');
  
  if (!fs.existsSync('db_export.json')) {
    console.error('db_export.json not found! Please run export_data.ts first while connected to SQLite.');
    process.exit(1);
  }

  const rawData = fs.readFileSync('db_export.json', 'utf-8');
  const data = JSON.parse(rawData);

  // Clear existing collections safely
  console.log('Clearing existing MongoDB collections...');
  try { await prisma.setting.deleteMany(); } catch (e) {}
  try { await prisma.address.deleteMany(); } catch (e) {}
  try { await prisma.orderItem.deleteMany(); } catch (e) {}
  try { await prisma.order.deleteMany(); } catch (e) {}
  try { await prisma.product.deleteMany(); } catch (e) {}
  try { await prisma.category.deleteMany(); } catch (e) {}
  try { await prisma.user.deleteMany(); } catch (e) {}

  // Import Users
  console.log(`Importing ${data.users.length} Users...`);
  if (data.users.length > 0) {
    await prisma.user.createMany({ data: data.users });
  }

  // Import Categories
  console.log(`Importing ${data.categories.length} Categories...`);
  if (data.categories.length > 0) {
    await prisma.category.createMany({ data: data.categories });
  }

  // Import Products
  console.log(`Importing ${data.products.length} Products...`);
  if (data.products.length > 0) {
    await prisma.product.createMany({ data: data.products });
  }

  // Import Orders
  console.log(`Importing ${data.orders.length} Orders...`);
  if (data.orders.length > 0) {
    await prisma.order.createMany({ data: data.orders });
  }

  // Import Order Items
  console.log(`Importing ${data.orderItems.length} OrderItems...`);
  if (data.orderItems.length > 0) {
    await prisma.orderItem.createMany({ data: data.orderItems });
  }

  // Import Addresses
  console.log(`Importing ${data.addresses.length} Addresses...`);
  if (data.addresses.length > 0) {
    await prisma.address.createMany({ data: data.addresses });
  }

  // Import Settings
  console.log(`Importing ${data.settings.length} Settings...`);
  if (data.settings.length > 0) {
    await prisma.setting.createMany({ data: data.settings });
  }

  console.log('Data successfully imported to MongoDB!');
}

importData()
  .catch(e => {
    console.error('Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
