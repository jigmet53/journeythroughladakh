import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DayInput {
  dayNumber: number;
  title: string;
  description: string;
  overnightAt?: string;
  distanceKm?: number;
  driveHours?: number;
  altitudeMeters?: number;
  destinationSlug?: string;
}

interface PackageInput {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  days: number;
  nights: number;
  difficulty: string;
  bestFor: string[];
  bestTime: string;
  startCity: string;
  estimatedBudget: string;
  highlights: string[];
  thingsToKnow: string[];
  itinerary: DayInput[];
}

// Researched against real, commonly-run Ladakh circuits (typical day-by-day
// structure, road names, altitudes, permit rules) — not fabricated. See the
// M6 commit message for sources. No prices-as-a-sale-price or inclusions/
// exclusions fields: there is no online payment/booking engine, so these read as route
// guides to follow yourself, not a package purchased here.
const packages: PackageInput[] = [
  {
    slug: '7-days-ladakh-classic-nubra-pangong',
    title: 'Ladakh Classic — Nubra & Pangong',
    tagline: 'The definitive first-time Ladakh circuit',
    summary:
      "The most-traveled Ladakh route for good reason: enough days to acclimatize properly, and it hits every major highlight — Khardung La, the Nubra sand dunes, Pangong's shifting blues, and Leh's monasteries — without feeling rushed.",
    days: 7,
    nights: 6,
    difficulty: 'Moderate',
    bestFor: ['First-time visitors', 'Couples', 'Small groups'],
    bestTime: 'June to September',
    startCity: 'Leh',
    estimatedBudget: '₹18,000 – ₹35,000 per person (self-planned, excluding flights)',
    highlights: [
      'Cross Khardung La and Chang La, two of the highest motorable passes in the world',
      "Camel safari among Hunder's sand dunes in Nubra Valley",
      'Sunset and sunrise at Pangong Lake',
      "Thiksey Monastery's dawn prayers, modeled on Lhasa's Potala Palace",
    ],
    thingsToKnow: [
      'Indian nationals no longer need an Inner Line Permit for Nubra/Pangong — a Ladakh Environment Fee applies instead. Foreign nationals need a Protected Area Permit, arranged through a registered Leh travel agent, and must travel in a group of two or more.',
      'Day 1 in Leh (11,500 ft) should be genuine rest — no exertion, no alcohol, hydrate often. Altitude sickness is the main real risk of this trip, not the road conditions.',
      'Khardung La (18,380 ft) and Chang La (17,688 ft) are both above 17,000 ft — expect cold, thin air, and possible mild headache even with good acclimatization.',
      'Carry layered clothing even in summer; nights in Nubra and at Pangong drop close to freezing.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive in Leh',
        description:
          'Fly or drive into Leh (11,500 ft) and rest for the day. This is the single most important day for acclimatization — light walking only, no alcohol, drink plenty of water.',
        overnightAt: 'Leh',
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 2,
        title: 'Leh sightseeing',
        description:
          'Gentle local sightseeing to continue acclimatizing: Leh Palace, Namgyal Tsemo monastery, Shanti Stupa, and the old town market.',
        overnightAt: 'Leh',
        distanceKm: 15,
        driveHours: 1,
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 3,
        title: 'Leh → Nubra Valley via Khardung La',
        description:
          'Cross Khardung La, then descend into Nubra Valley. Visit Diskit Monastery and take a camel safari among the sand dunes at Hunder.',
        overnightAt: 'Nubra Valley (Hunder/Diskit)',
        distanceKm: 120,
        driveHours: 5,
        altitudeMeters: 5602,
        destinationSlug: 'khardung-la',
      },
      {
        dayNumber: 4,
        title: 'Nubra Valley',
        description:
          'A slower day in Nubra — optionally drive further along the Shyok River to Turtuk, a Balti village near the Line of Control, one of the last villages opened to tourists.',
        overnightAt: 'Nubra Valley',
        altitudeMeters: 3048,
        destinationSlug: 'nubra-valley',
      },
      {
        dayNumber: 5,
        title: 'Nubra → Pangong Lake via Shyok Valley',
        description:
          'Drive along the Shyok River valley to Pangong Tso, arriving in time for sunset over the lake.',
        overnightAt: 'Pangong Lake',
        distanceKm: 150,
        driveHours: 6,
        altitudeMeters: 4225,
        destinationSlug: 'pangong-lake',
      },
      {
        dayNumber: 6,
        title: 'Pangong → Leh via Chang La',
        description:
          'Sunrise at the lake, then return to Leh over Chang La, stopping at Thiksey Monastery and Shey Palace en route.',
        overnightAt: 'Leh',
        distanceKm: 140,
        driveHours: 5,
        altitudeMeters: 5391,
        destinationSlug: 'thiksey-monastery',
      },
      {
        dayNumber: 7,
        title: 'Departure',
        description: 'Fly or drive out of Leh.',
        altitudeMeters: 3500,
      },
    ],
  },
  {
    slug: '5-days-ladakh-quick-escape',
    title: 'Ladakh Quick Escape',
    tagline: 'The classic highlights, condensed',
    summary:
      "For travelers with limited time: the same Nubra-Pangong circuit as the classic route, tightened to five days by dropping the second night in Nubra. It's a faster pace, so acclimatization discipline on day one matters even more.",
    days: 5,
    nights: 4,
    difficulty: 'Moderate',
    bestFor: ['Limited time', 'First-time visitors'],
    bestTime: 'June to September',
    startCity: 'Leh',
    estimatedBudget: '₹15,000 – ₹25,000 per person (self-planned, excluding flights)',
    highlights: [
      'Magnetic Hill and the Indus–Zanskar confluence at Sangam',
      'Khardung La and the Nubra sand dunes in a single loop',
      'Pangong Lake sunset',
      'Thiksey Monastery on the return leg',
    ],
    thingsToKnow: [
      'This pace only works if day one is genuinely restful — don\'t compress the acclimatization day to "see more."',
      'Same permit rules as the classic circuit: Ladakh Environment Fee for Indian nationals, Protected Area Permit via a registered agent for foreign nationals.',
      'Because there\'s only one night in Nubra, Turtuk village is out of reach on this itinerary — see the 7-day classic route if that matters to you.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive in Leh',
        description: 'Arrive and rest completely for the day — no exertion, hydrate often.',
        overnightAt: 'Leh',
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 2,
        title: 'Leh sightseeing',
        description:
          'Magnetic Hill, the Sangam (confluence of the Indus and Zanskar rivers), Shanti Stupa, and Leh Palace.',
        overnightAt: 'Leh',
        distanceKm: 80,
        driveHours: 3,
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 3,
        title: 'Leh → Nubra Valley via Khardung La',
        description: 'Cross Khardung La to Nubra Valley — Diskit Monastery, sand dunes, and a camel safari at Hunder.',
        overnightAt: 'Nubra Valley',
        distanceKm: 120,
        driveHours: 5,
        altitudeMeters: 5602,
        destinationSlug: 'khardung-la',
      },
      {
        dayNumber: 4,
        title: 'Nubra → Pangong Lake via Shyok Valley',
        description: 'Drive along the Shyok River to Pangong Tso, in time for sunset over the lake.',
        overnightAt: 'Pangong Lake',
        distanceKm: 150,
        driveHours: 6,
        altitudeMeters: 4225,
        destinationSlug: 'pangong-lake',
      },
      {
        dayNumber: 5,
        title: 'Pangong → Leh via Chang La, departure',
        description:
          'Return over Chang La, stopping at Thiksey Monastery, then straight to the airport or onward journey.',
        distanceKm: 140,
        driveHours: 5,
        altitudeMeters: 5391,
        destinationSlug: 'thiksey-monastery',
      },
    ],
  },
  {
    slug: '8-days-manali-to-leh-bike-trip',
    title: 'Manali to Leh — The Great Himalayan Bike Trip',
    tagline: 'The iconic overland motorcycle route',
    summary:
      'One of the most celebrated motorcycle routes in the world: five Himalayan passes, hairpin switchbacks, and landscapes that shift from green valleys to high-altitude desert — before the classic Nubra-Pangong loop out of Leh.',
    days: 8,
    nights: 7,
    difficulty: 'Challenging',
    bestFor: ['Motorcycle travelers', 'Adventure travelers', 'Repeat travelers'],
    bestTime: 'Mid-June to mid-September (road-dependent — confirm current Manali-Leh highway status before departure)',
    startCity: 'Manali',
    estimatedBudget: '₹35,000 – ₹55,000 per person, excluding bike rental (self-planned)',
    highlights: [
      'Rohtang Pass, Baralacha La, Nakee La, Lachulung La, and Tanglang La — five major Himalayan passes',
      'The Gata Loops: 21 hairpin bends cut into a mountainside',
      'Sarchu, camping at 14,000 ft on the Himachal–Ladakh border',
      'The full Nubra Valley and Pangong Lake loop once in Leh',
    ],
    thingsToKnow: [
      'This route is genuinely demanding: long riding days, thin air above 16,000 ft, and unpredictable weather. Prior high-altitude or long-distance riding experience matters more here than on any fly-into-Leh itinerary.',
      'The Manali–Leh highway is a seasonal road, typically open only from around June to September/October depending on snowfall — always confirm current status before departure, road conditions change fast at these altitudes.',
      'Sarchu and similar high-altitude camps have very basic facilities. Carry warm layers, a good sleeping bag, and any personal medication — options for both are extremely limited en route.',
      'Same Ladakh permit rules apply once you reach the Nubra/Pangong loop: Environment Fee for Indians, Protected Area Permit via a registered agent for foreign nationals.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Manali → Jispa/Keylong via Rohtang Pass',
        description:
          'Ride out of Manali and over Rohtang Pass, following the Bhaga river valley down to Keylong or Jispa for the first overnight halt.',
        overnightAt: 'Keylong / Jispa',
        distanceKm: 115,
        driveHours: 5,
        altitudeMeters: 3978,
      },
      {
        dayNumber: 2,
        title: 'Keylong → Sarchu via Baralacha La',
        description:
          'Climb to Baralacha La (16,040 ft) before descending to the high-altitude camps at Sarchu, on the Himachal–Ladakh border.',
        overnightAt: 'Sarchu',
        distanceKm: 130,
        driveHours: 5,
        altitudeMeters: 4890,
      },
      {
        dayNumber: 3,
        title: 'Sarchu → Leh via Gata Loops, Nakee La, Lachulung La & Tanglang La',
        description:
          'The longest and highest day of the trip: the Gata Loops\' 21 hairpin bends, then Nakee La, Lachulung La, and Tanglang La (17,480 ft) before dropping into Leh.',
        overnightAt: 'Leh',
        distanceKm: 250,
        driveHours: 9,
        altitudeMeters: 5328,
      },
      {
        dayNumber: 4,
        title: 'Rest day in Leh',
        description: 'A full rest day — the ride in was demanding. Light local sightseeing only.',
        overnightAt: 'Leh',
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 5,
        title: 'Leh → Nubra Valley via Khardung La',
        description: 'Cross Khardung La into Nubra Valley — Diskit Monastery and the Hunder sand dunes.',
        overnightAt: 'Nubra Valley',
        distanceKm: 120,
        driveHours: 5,
        altitudeMeters: 5602,
        destinationSlug: 'khardung-la',
      },
      {
        dayNumber: 6,
        title: 'Nubra → Pangong Lake via Shyok Valley',
        description: 'Ride the Shyok River valley road to Pangong Tso for sunset.',
        overnightAt: 'Pangong Lake',
        distanceKm: 150,
        driveHours: 6,
        altitudeMeters: 4225,
        destinationSlug: 'pangong-lake',
      },
      {
        dayNumber: 7,
        title: 'Pangong → Leh via Chang La',
        description: 'Return over Chang La, with a stop at Thiksey Monastery.',
        overnightAt: 'Leh',
        distanceKm: 140,
        driveHours: 5,
        altitudeMeters: 5391,
        destinationSlug: 'thiksey-monastery',
      },
      {
        dayNumber: 8,
        title: 'Departure from Leh',
        description: 'Fly out, or hand back a rented bike, from Leh.',
        altitudeMeters: 3500,
      },
    ],
  },
  {
    slug: '10-days-ladakh-off-beat-tso-moriri-hanle',
    title: 'Ladakh Off-Beat — Tso Moriri & Hanle',
    tagline: 'For repeat travelers who want the quiet side of Ladakh',
    summary:
      "Beyond the standard circuit: the remote Changthang plateau, the high-altitude lake at Tso Moriri, and Hanle's dark-sky reserve, one of the best stargazing sites in India. Fewer travelers, longer drives, and a genuinely different Ladakh.",
    days: 10,
    nights: 9,
    difficulty: 'Challenging',
    bestFor: ['Repeat travelers', 'Photographers', 'Wildlife & nature'],
    bestTime: 'June to September',
    startCity: 'Leh',
    estimatedBudget: '₹35,000 – ₹55,000 per person (self-planned, excluding flights)',
    highlights: [
      'Hanle Observatory — one of the highest optical telescope sites in the world, inside a dark-sky reserve',
      'Tso Moriri, quieter and less-visited than Pangong, inside the Changthang Wildlife Sanctuary',
      'Wildlife spotting — kiang (Tibetan wild ass) and black-necked cranes around Tso Moriri and Tso Kar',
      'The full Nubra Valley and Pangong Lake loop, plus Leh\'s main monasteries',
    ],
    thingsToKnow: [
      'Hanle and Tso Moriri require the same permits as Nubra/Pangong (Environment Fee for Indians, Protected Area Permit for foreign nationals) — Hanle and Chushul are both listed permit areas.',
      'This route spends more consecutive nights above 13,000 ft than the classic circuit. Build in the buffer/rest day on day 9 rather than skipping it — cumulative altitude exposure, not any single pass, is the real risk here.',
      'Facilities in Hanle and around Tso Moriri are basic — fewer hotel options than Leh or Pangong, book ahead.',
      'If dark-sky viewing at Hanle is a priority, check the moon phase before booking — a new-moon window gives dramatically better stargazing.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive in Leh',
        description: 'Arrive and rest completely — the main acclimatization day.',
        overnightAt: 'Leh',
        altitudeMeters: 3500,
        destinationSlug: 'leh-palace',
      },
      {
        dayNumber: 2,
        title: 'Leh monasteries',
        description: 'Shey Palace, Thiksey Monastery, and Hemis Monastery.',
        overnightAt: 'Leh',
        distanceKm: 60,
        driveHours: 3,
        altitudeMeters: 3500,
        destinationSlug: 'thiksey-monastery',
      },
      {
        dayNumber: 3,
        title: 'Leh → Nubra Valley via Khardung La',
        description: 'Cross Khardung La into Nubra Valley — Diskit Monastery and the Hunder sand dunes.',
        overnightAt: 'Nubra Valley',
        distanceKm: 120,
        driveHours: 5,
        altitudeMeters: 5602,
        destinationSlug: 'khardung-la',
      },
      {
        dayNumber: 4,
        title: 'Nubra → Pangong Lake via Shyok Valley',
        description: 'Drive along the Shyok River to Pangong Tso.',
        overnightAt: 'Pangong Lake',
        distanceKm: 150,
        driveHours: 6,
        altitudeMeters: 4225,
        destinationSlug: 'pangong-lake',
      },
      {
        dayNumber: 5,
        title: 'Pangong → Hanle',
        description:
          'Head deeper into the remote Changthang plateau to Hanle (13,800 ft), home to one of the world\'s highest optical observatories and a designated dark-sky reserve.',
        overnightAt: 'Hanle',
        driveHours: 6,
        altitudeMeters: 4206,
      },
      {
        dayNumber: 6,
        title: 'Hanle → Tso Moriri via Lumling La',
        description:
          'Cross Lumling La (19,024 ft) to reach Tso Moriri (15,000 ft), inside the Changthang Wildlife Sanctuary.',
        overnightAt: 'Tso Moriri',
        driveHours: 5,
        altitudeMeters: 5798,
        destinationSlug: 'tso-moriri',
      },
      {
        dayNumber: 7,
        title: 'Tso Moriri',
        description:
          'A full day at the lake — short hikes and wildlife spotting (kiang, black-necked cranes) around the Korzok nomadic settlement.',
        overnightAt: 'Tso Moriri',
        altitudeMeters: 4572,
        destinationSlug: 'tso-moriri',
      },
      {
        dayNumber: 8,
        title: 'Tso Moriri → Tso Kar → Leh via Tanglang La',
        description: 'Stop at Tso Kar, another high-altitude wetland known for wildlife, then cross Tanglang La back to Leh.',
        overnightAt: 'Leh',
        driveHours: 6,
        altitudeMeters: 5328,
      },
      {
        dayNumber: 9,
        title: 'Buffer day in Leh',
        description: 'A deliberate rest day after several consecutive nights above 13,000 ft — local markets, Sham Valley, or simply rest.',
        overnightAt: 'Leh',
        altitudeMeters: 3500,
      },
      {
        dayNumber: 10,
        title: 'Departure',
        description: 'Fly or drive out of Leh.',
        altitudeMeters: 3500,
      },
    ],
  },
];

async function main() {
  for (const pkg of packages) {
    const { itinerary, ...meta } = pkg;

    const days = await Promise.all(
      itinerary.map(async ({ destinationSlug, ...day }) => {
        if (!destinationSlug) return day;
        const destination = await prisma.destination.findUnique({ where: { slug: destinationSlug } });
        return { ...day, destinationId: destination?.id };
      }),
    );

    const existing = await prisma.tripPackage.findUnique({ where: { slug: pkg.slug } });
    if (existing) {
      await prisma.tripPackageDay.deleteMany({ where: { packageId: existing.id } });
      await prisma.tripPackage.update({
        where: { slug: pkg.slug },
        data: { ...meta, days_: { create: days } },
      });
    } else {
      await prisma.tripPackage.create({ data: { ...meta, days_: { create: days } } });
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${packages.length} trip packages.`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
