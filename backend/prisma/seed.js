require('../src/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateApiKey } = require('../src/utils/apiKey');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const consumerEmail = process.env.CONSUMER_EMAIL || 'consumer@marketplace.local';
  const consumerPassword = process.env.CONSUMER_PASSWORD || 'consumer123';

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: 'Admin',
        role: 'ADMIN',
        apiKey: generateApiKey(),
      },
    });
  } else if (!admin.apiKey) {
    admin = await prisma.user.update({
      where: { id: admin.id },
      data: { apiKey: generateApiKey() },
    });
  }

  let consumer = await prisma.user.findUnique({ where: { email: consumerEmail } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: consumerEmail,
        password: await bcrypt.hash(consumerPassword, 10),
        name: 'Consumer',
        apiKey: generateApiKey(),
      },
    });
  } else if (!consumer.apiKey) {
    consumer = await prisma.user.update({
      where: { id: consumer.id },
      data: { apiKey: generateApiKey() },
    });
  }

  let weatherApi = await prisma.api.findUnique({ where: { slug: 'weather' } });
  if (!weatherApi) {
    weatherApi = await prisma.api.create({
      data: {
        slug: 'weather',
        title: 'Weather API',
        description: 'Sample weather data API',
        baseUrl: 'https://api.example.com/weather',
        category: 'data',
        pricePerCall: 0.01,
        defaultQuota: 10,
        status: 'APPROVED',
        providerId: admin.id,
      },
    });
  }

  const existingSub = await prisma.subscription.findUnique({
    where: { userId_apiId: { userId: consumer.id, apiId: weatherApi.id } },
  });

  if (!existingSub) {
    const purchase = await prisma.purchase.create({
      data: {
        userId: consumer.id,
        apiId: weatherApi.id,
        amount: 0,
        quota: weatherApi.defaultQuota,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: consumer.id,
        apiId: weatherApi.id,
        purchaseId: purchase.id,
        totalQuota: purchase.quota,
        remainingQuota: purchase.quota,
      },
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
