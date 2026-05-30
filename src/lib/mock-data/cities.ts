import { createSeededRandom } from "./seeded-random";

const CITY_NAMES = [
  "Neo Tokyo","Arcadia Prime","Port Nexus","Veridian City","Helios Bay","Stormhaven",
  "Irongate","Crystallis","Duskwall","Aetherport","Coldspire","Sunmere","Vaulthold",
  "Embercroft","Mistfall","Ravensdale","Thornwick","Goldmere","Ashford","Brightwater",
  "Crestholm","Dunveil","Eastbrook","Ferndale","Graveston","Highcliff","Ironwood",
  "Jadeton","Keelport","Larkspur","Moorfield","Northgate","Oldbridge","Palmdale",
  "Queensbury","Ridgeton","Saltmarsh","Thornbury","Underhill","Veloria","Westmere",
  "Xenopolis","Yellowstone","Zephyrhaven","Aldergate","Bronzewick","Copperholm",
  "Darkwater","Edgecliff","Fogmere","Greenwood","Harborview","Islington","Jetstream",
  "Kinport","Lakewood","Marshend","Nightfall","Oakhaven","Pinecrest","Quarrystone",
  "Riverside","Stonegate","Tidehaven","Upton","Valcrest","Wavemere","Xerxes Port",
  "Yearling","Zodiac Falls","Ambervale","Blackshore","Crowmoor","Dusthaven",
  "Eldenmere","Frostwick","Gatewatch","Hollowbrook","Ironmere","Juniperton",
  "Kaelport","Lumbridge","Moonhaven","Norgate","Oldwick","Pebblestone",
  "Queensmere","Rockwall","Silverbrook","Tidewater","Undergate","Veilmere",
  "Whitestone","Xanther","Yewdale","Zirconia","Almswick","Bridgemoor","Cobaltis",
  "Dawnbrook","Emberhaven","Forestone","Galewood","Harkmere","Ironthorn","Jasperton",
  "Kindlemere","Lanternport","Mistwood","Nightwick","Oldmere","Puregate","Quartzholm",
  "Redwater","Stonecliff","Timberdale","Umberwick","Verdance","Whitecliff",
];

const COUNTRIES = [
  "Novaria","Arcturia","Solendris","Kaelthar","Vymora","Zephyria","Ironhold",
  "Crystalis","Emberia","Frostmere","Goldenia","Harkmoor","Islandria","Jadoria",
];
const GOV_TYPES = ["Democracy","Republic","Monarchy","Federation","City-State","Autonomous"] as const;
const TIMEZONES = ["UTC-8","UTC-5","UTC+0","UTC+1","UTC+3","UTC+5:30","UTC+8","UTC+9","UTC+11"];
const LANGUAGES = ["English","French","Spanish","Mandarin","Arabic","German","Japanese","Portuguese","Russian","Italian","Korean","Hindi"];

export interface City {
  id: string;
  name: string;
  country: string;
  population: number;
  crimeIndex: number;
  founded: string;
  governmentType: string;
  gdpPerCapita: number;
  timezone: string;
  isCapital: boolean;
  officialLanguages: string[];
}

function isoDate(rng: () => number, startYear = 1200, endYear = 1990): string {
  const year = startYear + Math.floor(rng() * (endYear - startYear + 1));
  const month = String(Math.floor(rng() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(rng() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function generateCities(count = 124): City[] {
  const rng = createSeededRandom(99);
  return Array.from({ length: count }, (_, i) => {
    const langCount = 1 + Math.floor(rng() * 3);
    const langs: string[] = [];
    for (let j = 0; j < langCount; j++) {
      const lang = LANGUAGES[Math.floor(rng() * LANGUAGES.length)];
      if (!langs.includes(lang)) langs.push(lang);
    }
    return {
      id: `city-${i + 1}`,
      name: CITY_NAMES[i % CITY_NAMES.length],
      country: COUNTRIES[Math.floor(rng() * COUNTRIES.length)],
      population: Math.floor(rng() * 10_000_000) + 50_000,
      crimeIndex: Math.round(rng() * 100 * 10) / 10,
      founded: isoDate(rng),
      governmentType: GOV_TYPES[Math.floor(rng() * GOV_TYPES.length)],
      gdpPerCapita: Math.floor(rng() * 120_000) + 2_000,
      timezone: TIMEZONES[Math.floor(rng() * TIMEZONES.length)],
      isCapital: rng() > 0.8,
      officialLanguages: langs,
    };
  });
}

export const cities = generateCities();
