// Photo catalog — every image under public/images/ with its alt text and the
// author/licence details Wikimedia Commons publishes for it. All are freely
// licensed (CC BY / CC BY-SA), which requires attribution; the credits page
// and the caption on each hero read from here so it can't drift from the files.
// Each photo ships as <id>-800.jpg (cards) and <id>-1600.jpg (hero, detail).

export interface PhotoMeta {
  alt: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export const photos = {
  'hero-indus-road': {
    alt: 'A winding mountain road descending into the green Indus valley beneath snow-capped peaks near Leh',
    width: 1600,
    height: 1067,
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=129324413',
  },
  'pangong-lake': {
    alt: 'Deep blue waters of Pangong Tso with sunlit brown mountains under a bright sky',
    width: 1600,
    height: 774,
    author: 'KennyOMG',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=39923940',
  },
  'pangong-lake-2': {
    alt: 'Still water at Pangong Tso mirroring the surrounding mountains',
    width: 1600,
    height: 1067,
    author: 'Neek-Theri',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=138684871',
  },
  'nubra-camels': {
    alt: 'A resting Bactrian camel in a colourful saddle at the Hunder sand dunes in Nubra Valley',
    width: 1600,
    height: 1067,
    author: 'Lianguanlun',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=178738523',
  },
  'nubra-dunes': {
    alt: 'Pale sand dunes at Hunder with the green Nubra Valley and mountains behind',
    width: 1600,
    height: 1024,
    author: 'Raghavan V',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=20985702',
  },
  'diskit-monastery': {
    alt: 'Whitewashed Diskit Monastery clinging to a rocky hillside in Nubra Valley',
    width: 1600,
    height: 1067,
    author: 'Specialsharp87',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=110588805',
  },
  'leh-palace': {
    alt: 'The nine-storey mudbrick Leh Palace rising above the old town under a blue sky',
    width: 1600,
    height: 1066,
    author: 'Rayan Naqash',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=21713733',
  },
  'shanti-stupa': {
    alt: 'Painted Buddha panels and ornate carving around the Shanti Stupa in Leh',
    width: 1600,
    height: 1067,
    author: 'Bernard Gagnon',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=76194589',
  },
  'khardung-la': {
    alt: 'Rock pinnacle above the Khardung La road with the Indus valley and snow peaks far below',
    width: 1600,
    height: 1067,
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=129324428',
  },
  'khardung-la-2': {
    alt: 'The Khardung La summit sign with the Ladakh range in the distance',
    width: 1600,
    height: 1067,
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=129324415',
  },
  'thiksey-monastery': {
    alt: 'Prayer flags and an ochre courtyard at Thiksey Monastery with snow mountains behind',
    width: 1600,
    height: 1067,
    author: 'Bernard Gagnon',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=76389636',
  },
  'thiksey-buddha': {
    alt: 'The gilded face of the giant Maitreya Buddha statue at Thiksey Monastery',
    width: 1600,
    height: 1067,
    author: 'Bernard Gagnon',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=76390054',
  },
  'tso-moriri': {
    alt: 'A white monastery building beside the deep blue Tso Moriri in the village of Korzok',
    width: 1600,
    height: 1068,
    author: 'Ingo Mehling',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=140167527',
  },
  'tso-moriri-2': {
    alt: 'The pebbled shore of Tso Moriri beneath golden hills and a big Changthang sky',
    width: 1600,
    height: 1067,
    author: 'Ingo Mehling',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=140167599',
  },
  'baralacha-la': {
    alt: 'A broad glacial valley below Baralacha La with snow-covered peaks and trucks on the road',
    width: 1600,
    height: 1067,
    author: 'Timothy Gonsalves',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=94640861',
  },
  'lahaul-road': {
    alt: 'A hairpin bend on the Manali–Leh highway through green Lahaul mountains',
    width: 1600,
    height: 1067,
    author: 'Lianguanlun',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=178738529',
  },
  'tso-kar': {
    alt: 'Horses grazing on the open plain beside Tso Kar under a deep blue sky',
    width: 1600,
    height: 1060,
    author: 'Nitai Mondal',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=60253036',
  },
  'hero-sunset-indus': {
    alt: 'Golden sunset light behind a hilltop building above the Indus river in Ladakh',
    width: 1600,
    height: 1064,
    author: 'CA ANAND V KAKU',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=49813690',
  },
  'spangmik-sunset': {
    alt: 'A snow-covered peak glowing under a pink sunset sky at Spangmik near Pangong Lake',
    width: 1600,
    height: 1067,
    author: 'Saad Faruque from Bangalore, India',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=41640477',
  },
} satisfies Record<string, PhotoMeta>;

export type PhotoId = keyof typeof photos;
