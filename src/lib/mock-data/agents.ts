import { createSeededRandom } from "./seeded-random";

const CODENAMES = [
  "Ghost","Cipher","Viper","Shadow","Raven","Phantom","Eclipse","Talon","Ember","Mirage",
  "Spectre","Wraith","Dagger","Onyx","Cobalt","Zephyr","Vector","Nexus","Axiom","Prism",
  "Flux","Volt","Helix","Quartz","Nova","Blade","Cinder","Frost","Gale","Haze",
  "Iris","Jade","Knox","Lynx","Mace","Nimbus","Orbit","Pike","Quest","Ridge",
  "Sage","Titan","Umbra","Vapor","Wren","Xray","Yield","Zinc","Arrow","Bravo",
  "Cruz","Delta","Echo","Foxtrot","Gust","Haven","Iron","Joker","Karma","Lance",
  "Maven","Neon","Oscar","Pearl","Quota","Recon","Storm","Trace","Unity","Valor",
  "Whisper","Xenon","Yankee","Zulu","Alpha","Baron","Coast","Drake","Eagle","Falcon",
  "Gamma","Hydra","Indigo","Juno","Kestrel","Lancer",
];

const LEVELS = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"] as const;
const STATUSES = ["active", "inactive", "compromised", "retired"] as const;
const REGIONS = ["EMEA", "APAC", "Americas", "MENA", "Global"] as const;
const SPECIALIZATIONS = ["Infiltration", "Surveillance", "Combat", "Cyber", "Extraction", "Analysis"] as const;
const ALL_LANGUAGES = ["English","French","Russian","Mandarin","Arabic","Spanish","German","Japanese","Farsi","Korean","Portuguese","Italian"];

export interface Agent {
  id: string;
  codename: string;
  clearanceLevel: string;
  lastSeen: string;
  missionsCompleted: number;
  status: string;
  region: string;
  compromised: boolean;
  specialization: string;
  languages: string[];
}

function isoDate(rng: () => number, startYear = 2020, endYear = 2026): string {
  const year = startYear + Math.floor(rng() * (endYear - startYear + 1));
  const month = String(Math.floor(rng() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(rng() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function generateAgents(count = 87): Agent[] {
  const rng = createSeededRandom(42);
  return Array.from({ length: count }, (_, i) => {
    const langCount = 1 + Math.floor(rng() * 4);
    const langs: string[] = [];
    for (let j = 0; j < langCount; j++) {
      const lang = ALL_LANGUAGES[Math.floor(rng() * ALL_LANGUAGES.length)];
      if (!langs.includes(lang)) langs.push(lang);
    }
    return {
      id: `agent-${i + 1}`,
      codename: CODENAMES[i % CODENAMES.length],
      clearanceLevel: LEVELS[Math.floor(rng() * LEVELS.length)],
      lastSeen: isoDate(rng),
      missionsCompleted: Math.floor(rng() * 200),
      status: STATUSES[Math.floor(rng() * STATUSES.length)],
      region: REGIONS[Math.floor(rng() * REGIONS.length)],
      compromised: rng() > 0.85,
      specialization: SPECIALIZATIONS[Math.floor(rng() * SPECIALIZATIONS.length)],
      languages: langs,
    };
  });
}

export const agents = generateAgents();
