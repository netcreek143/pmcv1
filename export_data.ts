import prisma from './src/lib/prisma.js';
import fs from 'fs';

async function exportData() {
  console.log('Exporting data from SQLite...');
  
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany();
  const orderItems = await prisma.orderItem.findMany();
  const addresses = await prisma.address.findMany();
  const settings = await prisma.setting.findMany();
  
  const data = {
    users,
    categories,
    products,
    orders,
    orderItems,
    addresses,
    settings
  };
  
  fs.writeFileSync('db_export.json', JSON.stringify(data, null, 2));
  console.log('Data successfully exported to db_export.json');
}

exportData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
