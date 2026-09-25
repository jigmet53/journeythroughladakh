// FAQ content, shared by the FAQ page, the home page teaser and the FAQPage
// structured data so the three can't drift. Anything that changes over time
// (permits, road status, SIM rules) is deliberately hedged and points to an
// official local source rather than stating a rule as fact.

export interface FaqItem {
  q: string;
  a: string;
  link?: { to: string; label: string };
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'planning',
    title: 'Planning',
    items: [
      {
        q: 'When is the best time to visit Ladakh?',
        a: 'Most visitors go between May and September, when the high passes are generally open and days are warm. June to August is the busiest stretch; May and September are quieter, with cooler nights and often the clearest skies. Winter is possible but many roads close and it gets far below freezing, so it suits experienced, well-prepared travellers.',
        link: { to: '/guide#best-time', label: 'Month-by-month guide' },
      },
      {
        q: 'How many days do I need?',
        a: 'Plan at least five: one or two to acclimatise in Leh, then Nubra and Pangong. A week gives comfortable pacing, and the Manali to Leh road trip needs about eight days. Our trip packages run from 5 to 10 days.',
        link: { to: '/packages', label: 'See trip packages' },
      },
      {
        q: 'Is Ladakh suitable for families and first-time visitors?',
        a: 'Yes, with sensible pacing. The main risk is altitude, so build in rest days early and avoid over-packed itineraries. Our "first-time visitors" and "families" routes are paced with that in mind.',
      },
      {
        q: 'Do I need to book in advance?',
        a: 'In peak season (roughly June to August) book flights and stays early, especially in popular places such as Nubra and Pangong, where camps and guesthouses are limited. Outside peak season you have more flexibility.',
      },
    ],
  },
  {
    id: 'permits',
    title: 'Permits & access',
    items: [
      {
        q: 'Do I need a permit for Nubra, Pangong or Tso Moriri?',
        a: 'Some areas near the border are restricted and need permits, and the rules differ for Indian and foreign nationals. Requirements, fees and the way to apply change, so confirm with the Leh district administration or tourism office (or the official portal) shortly before you travel. Hotels and registered travel agents in Leh can usually help arrange them.',
      },
      {
        q: 'Are the roads open all year?',
        a: 'No. The highways from Manali and Srinagar and passes such as Khardung La and Chang La can close for snow or repairs. The Manali to Leh road typically opens in early summer and closes in autumn, but dates vary every year. Check the current status locally before you set out.',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health & safety',
    items: [
      {
        q: 'How do I avoid altitude sickness?',
        a: 'Leh sits at about 3,500 m. Rest for the first 24 to 48 hours, drink plenty of water, avoid alcohol and strenuous activity at first, and gain height gradually. Persistent headache, nausea, dizziness or breathlessness at rest are warning signs: do not climb higher, and if symptoms are severe, descend and get medical help. Talk to your doctor before you travel about prevention, including any medication.',
        link: { to: '/guide#altitude', label: 'Altitude & health' },
      },
      {
        q: 'Is medical help available?',
        a: 'Leh has a hospital and clinics, but remote areas are hours from care. Carry a basic first-aid kit and any regular medication, and get travel insurance that covers high altitude and evacuation. Check the policy wording before you buy.',
      },
      {
        q: 'Is it safe to drive or ride in Ladakh?',
        a: 'Roads are high, often narrow, and can have landslides, loose gravel and water crossings. Drive slowly, avoid night driving, allow extra time and never rush a pass. If you are riding, use a reliable machine and carry basic spares.',
      },
    ],
  },
  {
    id: 'getting-there',
    title: 'Getting there & around',
    items: [
      {
        q: 'How do I get to Leh?',
        a: 'By air to Leh airport, which has flights from Delhi and some other cities, or by road on the Manali to Leh or Srinagar to Leh highways, which are only open in the warmer months. Flying is fastest but gives no acclimatisation; road trips are long days over high passes. Either way, plan a rest day on arrival.',
        link: { to: '/guide#getting-there', label: 'Getting there' },
      },
      {
        q: 'How do I get around once I am there?',
        a: 'Hired taxis with local drivers are the most common way to see the sights, and shared taxis and buses link Leh with some destinations. Renting a bike or car in Leh is popular too. Check locally which areas allow self-drive under current rules.',
      },
    ],
  },
  {
    id: 'money',
    title: 'Money & connectivity',
    items: [
      {
        q: 'Should I carry cash?',
        a: 'Yes. Leh has banks and ATMs, but outside town they can be unreliable or out of cash, and many small guesthouses and camps prefer cash. Withdraw enough in Leh for the remote leg of your trip.',
      },
      {
        q: 'Will my phone work?',
        a: 'Coverage is reasonable in Leh and patchy elsewhere. In Jammu & Kashmir and Ladakh, prepaid SIMs from other regions often do not work, while postpaid plans generally do, so check with your operator before you go. Wi-Fi at remote stays can be slow or absent. Download maps and this itinerary ahead of time.',
      },
    ],
  },
  {
    id: 'this-site',
    title: 'About this site',
    items: [
      {
        q: 'Can I book a trip package here?',
        a: 'Yes, you can send a booking request from any trip package page. Every route is also free to follow on your own if you prefer to organise it yourself.',
        link: { to: '/packages', label: 'Choose a route' },
      },
      {
        q: 'What happens after I send a booking request?',
        a: 'You get a reference code straight away, and we contact you by email or phone to confirm availability for your dates, the price and what is included. No payment is taken online, and you are not committed until you confirm with us.',
      },
      {
        q: 'How accurate is the AI guide?',
        a: 'It answers from the destination knowledge on this site, so it is grounded in checked information, but it can still be wrong or out of date. It does not know live weather, road status or permit rules, so verify anything safety-critical locally.',
        link: { to: '/ai', label: 'Ask the AI guide' },
      },
      {
        q: 'Do I need an account?',
        a: 'Not to browse, use the planner or chat with the AI guide. You need a free account only to save itineraries, edit them later and share a link.',
      },
      {
        q: 'Where do your photos come from?',
        a: 'They are freely licensed photographs from Wikimedia Commons, each credited to its photographer with the licence and a link to the original.',
        link: { to: '/credits', label: 'Photo credits' },
      },
      {
        q: 'I found a mistake. How do I report it?',
        a: 'Please tell us. Use the contact form and choose "Correction", and include the page and what should change. Accurate information matters most when it affects safety.',
        link: { to: '/contact', label: 'Contact us' },
      },
    ],
  },
];

export const allFaqItems: FaqItem[] = faqCategories.flatMap((c) => c.items);

/** The handful shown on the home page. */
export const homeFaqItems: FaqItem[] = [
  allFaqItems[0], // best time
  allFaqItems[1], // how many days
  allFaqItems.find((i) => i.q.startsWith('How do I avoid altitude'))!,
  allFaqItems.find((i) => i.q.startsWith('Do I need a permit'))!,
];
