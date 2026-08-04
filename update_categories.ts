import { prisma } from './src/lib/prisma';
import { DEFAULT_CATEGORIES } from './src/lib/constants';

async function main() {
  const result = await prisma.category.updateMany({
    where: {
      name: {
        in: DEFAULT_CATEGORIES.map(c => c.name),
      },
    },
    data: {
      isDefault: true,
    },
  });
  console.log(`Updated ${result.count} default categories.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
