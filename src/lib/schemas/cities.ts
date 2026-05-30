import type { Schema } from "@/lib/query-engine/types";

export const citiesSchema: Schema = {
  id: "cities",
  name: "Cities",
  description: "Global urban analytics data",
  recordCount: 124,
  fields: [
    { name: "name", type: "string", label: "City Name" },
    { name: "country", type: "string", label: "Country" },
    { name: "population", type: "number", label: "Population", min: 0 },
    { name: "crimeIndex", type: "number", label: "Crime Index", min: 0, max: 100 },
    { name: "founded", type: "date", label: "Founded" },
    {
      name: "governmentType",
      type: "enum",
      label: "Government Type",
      enumValues: ["Democracy", "Republic", "Monarchy", "Federation", "City-State", "Autonomous"],
    },
    { name: "gdpPerCapita", type: "number", label: "GDP Per Capita (USD)", min: 0 },
    { name: "timezone", type: "string", label: "Timezone" },
    { name: "isCapital", type: "boolean", label: "Is Capital" },
    { name: "officialLanguages", type: "array", label: "Official Languages" },
  ],
};
