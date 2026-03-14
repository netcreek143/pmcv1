import prisma from '../lib/prisma.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seed process...');

  // 1. Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@packmycake.com' },
    update: {},
    create: {
      email: 'admin@packmycake.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 2. Try to scrape categories from the live site
  let categories = [
    { name: 'Cake Boxes', slug: 'cake-boxes', description: 'Premium cake boxes for all sizes.' },
    { name: 'Cake Boards', slug: 'cake-boards', description: 'Sturdy cake boards.' },
    { name: 'Cupcake Boxes', slug: 'cupcake-boxes', description: 'Boxes for cupcakes and muffins.' },
    { name: 'Macaron Boxes', slug: 'macaron-boxes', description: 'Elegant macaron packaging.' },
  ];

  try {
    console.log('Attempting to scrape categories from packmycake.com...');
    const { data } = await axios.get('https://www.packmycake.com');
    const $ = cheerio.load(data);
    
    // This is a generic selector, might need adjustment based on actual site structure
    const scrapedCategories: any[] = [];
    $('.category-item, .collection-item').each((i, el) => {
      const name = $(el).find('.title, h3, h2').text().trim();
      if (name && scrapedCategories.length < 10) {
        scrapedCategories.push({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Premium ${name}`,
        });
      }
    });

    if (scrapedCategories.length > 0) {
      categories = scrapedCategories;
      console.log(`Successfully scraped ${categories.length} categories.`);
    }
  } catch (error) {
    console.log('Scraping failed, using fallback categories.');
  }

  // Insert categories
  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(created);
  }

  // 3. Create sample products
  const products = [
    {
      name: 'White Window Cake Box - 10x10x5',
      slug: 'white-window-cake-box-10x10x5',
      description: 'High quality white cake box with a clear window. Perfect for 1kg cakes.',
      price: 45.00,
      stock: 500,
      images: JSON.stringify(['https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&q=80&w=800']),
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Gold Cake Board - 10 inch',
      slug: 'gold-cake-board-10-inch',
      description: 'Sturdy 3mm MDF cake board with premium gold foil finish.',
      price: 35.00,
      stock: 1000,
      images: JSON.stringify(['https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800']),
      categoryId: createdCategories[1]?.id || createdCategories[0].id,
    },
    {
      name: 'Kraft Cupcake Box - 6 Cavity',
      slug: 'kraft-cupcake-box-6-cavity',
      description: 'Eco-friendly kraft box with insert for 6 standard cupcakes.',
      price: 25.00,
      stock: 300,
      images: JSON.stringify(['https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800']),
      categoryId: createdCategories[2]?.id || createdCategories[0].id,
    },
    {
      name: 'Clear Macaron Box - Holds 10',
      slug: 'clear-macaron-box-holds-10',
      description: 'Crystal clear plastic box for displaying 10 macarons perfectly.',
      price: 15.00,
      stock: 800,
      images: JSON.stringify(['https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800']),
      categoryId: createdCategories[3]?.id || createdCategories[0].id,
    },
    {
      name: 'Tall Cake Box - 12x12x12',
      slug: 'tall-cake-box-12x12x12',
      description: 'Extra tall corrugated box for tiered cakes.',
      price: 85.00,
      stock: 200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=800']),
      categoryId: createdCategories[0].id,
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
