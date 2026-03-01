const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'n_aveen@outlook.com';
  const password = 'youaregood';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      firstName: 'Naveen',
      lastName: 'Singh',
      memberships: {
        create: {
          organization: {
            create: {
              name: 'Naveen Org',
              slug: 'naveen-org',
            },
          },
          role: 'OWNER',
        },
      },
    },
  });

  console.log('User verified/created:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
