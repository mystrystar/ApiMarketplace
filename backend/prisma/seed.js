require('../src/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateApiKey, hashApiKey } = require('../src/utils/apiKey');

const prisma = new PrismaClient();

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required for seeding`);
    console.log(`⚠️ ${name} not set, skipping related seed data`);
  }

  return value;
}

async function main() {
  const subscriptions = await prisma.subscription.findMany({
    select: { id: true, apiKey: true, apiKeyHash: true },
  });

  for (const subscription of subscriptions) {
    const expectedHash = hashApiKey(subscription.apiKey);
    if (subscription.apiKeyHash !== expectedHash) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { apiKeyHash: expectedHash },
      });
    }
  }

  const adminEmail = requireEnv('ADMIN_EMAIL');
  const adminPassword = requireEnv('ADMIN_PASSWORD');
  const consumerEmail = requireEnv('CONSUMER_EMAIL');
  const consumerPassword = requireEnv('CONSUMER_PASSWORD');

  // Create Admin User
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin created');
  }

  // Create Consumer User
  let consumer = await prisma.user.findUnique({
    where: { email: consumerEmail },
  });

  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: consumerEmail,
        password: await bcrypt.hash(
          consumerPassword,
          10
        ),
        name: 'Consumer',
      },
    });

  }

  // Create Sample API
  let weatherApi = await prisma.api.findUnique({
    where: {
      slug_method: {
        slug: 'weather',
        method: 'POST',
      },
    },
  });

  if (!weatherApi) {
    weatherApi = await prisma.api.create({
      data: {
        slug: 'weather',
        title: 'Weather API',
        description: 'Sample weather data API',
        baseUrl:
          'https://api.example.com/weather',
        method: 'POST',
        category: 'data',
        pricePerCall: 0.01,
        defaultQuota: 10,
        status: 'APPROVED',
        providerId: admin.id,
      },
    });
  }

  // Check Existing Subscription
  const existingSub =
    await prisma.subscription.findUnique({
      where: {
        userId_apiId: {
          userId: consumer.id,
          apiId: weatherApi.id,
        },
      },
    });

  if (!existingSub) {
    // Create Purchase
    const purchase =
      await prisma.purchase.create({
        data: {
          userId: consumer.id,
          apiId: weatherApi.id,
          amount: 0,
          quota: weatherApi.defaultQuota,
        },
      });

    // Generate API Key
    const apiKey = generateApiKey();

    // Create Subscription
    await prisma.subscription.create({
      data: {
        userId: consumer.id,
        apiId: weatherApi.id,
        purchaseId: purchase.id,
        apiKey,
        apiKeyHash: hashApiKey(apiKey),
        totalQuota: purchase.quota,
        remainingQuota: purchase.quota,
      },
    });
  }
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
