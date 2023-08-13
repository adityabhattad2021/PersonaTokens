const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Famous People' },
        { name: 'Game Characters' },
        { name: 'Animals' },
        { name: 'Fictional Character' },
        { name: 'Philosophy' },
        { name: 'Friendship' },
        { name: 'Coaching' },
      ],
    });
  } catch (error) {
    console.log('Error seeding default categories:', error);
  } finally {
    await db.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Seeding categories successful!');
  })
  .catch((error) => {
    console.log(error);
  });
