import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Lakes', slug: 'lakes' },
  { name: 'Monasteries', slug: 'monasteries' },
  { name: 'Valleys', slug: 'valleys' },
  { name: 'Mountain Passes', slug: 'mountain-passes' },
  { name: 'Heritage', slug: 'heritage' },
];

const destinations = [
  {
    slug: 'pangong-lake',
    name: 'Pangong Lake',
    summary: 'A high-altitude endorheic lake famous for its shifting blues, stretching from India into Tibet.',
    overview:
      'Pangong Tso sits at roughly 4,225m and stretches over 130km, two-thirds of it in Tibet. Its color shifts through blue, green and grey across the day, and it remains one of the most photographed destinations in Ladakh.',
    bestTime: 'May to September',
    howToReach: 'Leh to Pangong via Chang La pass, roughly 5-6 hours by road.',
    distanceFromLeh: 160,
    altitudeMeters: 4225,
    latitude: 33.7526,
    longitude: 78.6614,
    categorySlug: 'lakes',
  },
  {
    slug: 'nubra-valley',
    name: 'Nubra Valley',
    summary: 'A high-altitude cold desert valley known for sand dunes, double-humped camels, and monasteries.',
    overview:
      'Reached via Khardung La, Nubra Valley sits at the confluence of the Shyok and Nubra rivers. Its cold-desert sand dunes at Hunder, Bactrian camels, and Diskit Monastery make it one of Ladakh\'s most distinctive regions.',
    bestTime: 'May to September',
    howToReach: 'Leh to Nubra via Khardung La, roughly 4-5 hours by road.',
    distanceFromLeh: 120,
    altitudeMeters: 3048,
    latitude: 34.6803,
    longitude: 77.5646,
    categorySlug: 'valleys',
  },
  {
    slug: 'leh-palace',
    name: 'Leh Palace',
    summary: 'A 17th-century royal palace overlooking Leh town, modeled on the Potala Palace in Lhasa.',
    overview:
      'Built by King Sengge Namgyal in the 17th century, Leh Palace once housed the Namgyal dynasty before it moved to Stok. Its nine-story mudbrick structure now stands mostly empty but offers panoramic views over Leh and the surrounding mountains.',
    bestTime: 'April to October',
    howToReach: 'Short walk or drive from central Leh market.',
    distanceFromLeh: 1,
    altitudeMeters: 3524,
    latitude: 34.1665,
    longitude: 77.5849,
    categorySlug: 'heritage',
  },
  {
    slug: 'khardung-la',
    name: 'Khardung La',
    summary: 'One of the world\'s highest motorable mountain passes, the gateway to Nubra Valley.',
    overview:
      'Khardung La connects Leh to the Shyok and Nubra valleys. Once claimed as the world\'s highest motorable pass, it remains a rite of passage for motorcycle travelers and offers dramatic views of the Ladakh range.',
    bestTime: 'May to September (weather-dependent, verify road status before travel)',
    howToReach: 'North from Leh, roughly 1.5-2 hours by road.',
    distanceFromLeh: 40,
    altitudeMeters: 5359,
    latitude: 34.2792,
    longitude: 77.6034,
    categorySlug: 'mountain-passes',
  },
  {
    slug: 'thiksey-monastery',
    name: 'Thiksey Monastery',
    summary: 'A twelve-story monastery complex resembling Lhasa\'s Potala Palace, home to a 15m Maitreya Buddha statue.',
    overview:
      'Thiksey Monastery belongs to the Gelug order and sits on a hilltop overlooking the Indus valley. Its dawn prayer ceremonies and the large seated Maitreya Buddha statue installed in 1980 make it one of the most visited monasteries near Leh.',
    bestTime: 'Year-round; dawn prayers are best experienced May to September',
    howToReach: 'Leh to Thiksey, roughly 30-40 minutes by road.',
    distanceFromLeh: 19,
    altitudeMeters: 3600,
    latitude: 34.0556,
    longitude: 77.6997,
    categorySlug: 'monasteries',
  },
  {
    slug: 'tso-moriri',
    name: 'Tso Moriri',
    summary: 'A remote, protected high-altitude lake in the Changthang plateau, quieter than Pangong.',
    overview:
      'Tso Moriri lies within the Changthang Wildlife Sanctuary and sees far fewer visitors than Pangong Tso due to its distance and permit requirements. It supports breeding grounds for the black-necked crane and is bordered by the nomadic settlement of Korzok.',
    bestTime: 'May to September',
    howToReach: 'Leh to Tso Moriri via Chumathang, roughly 7-8 hours by road.',
    distanceFromLeh: 220,
    altitudeMeters: 4522,
    latitude: 32.9021,
    longitude: 78.3287,
    categorySlug: 'lakes',
  },
];

async function main() {
  for (const category of categories) {
    await prisma.destinationCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  for (const { categorySlug, ...destination } of destinations) {
    const category = await prisma.destinationCategory.findUnique({ where: { slug: categorySlug } });
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: { ...destination, categoryId: category?.id },
      create: { ...destination, categoryId: category?.id },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${categories.length} categories and ${destinations.length} destinations.`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
