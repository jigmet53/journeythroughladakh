import { PrismaClient, Role } from '@prisma/client';

/**
 * `npm run admin:promote -- you@example.com` — gives an existing account the
 * ADMIN role so it can read booking requests and contact messages in the
 * in-app Inbox. Register the account through the site first.
 */
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error('Usage: npm run admin:promote -- <email>');
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`No account found for ${email}. Register on the site first, then run this again.`);
      process.exit(1);
    }
    await prisma.user.update({ where: { id: user.id }, data: { role: Role.ADMIN } });
    console.log(`${email} is now an ADMIN. Log out and back in to pick up the new role.`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
