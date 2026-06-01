import { describe, it, expect, beforeEach } from "vitest";
import { useCustomDataStore } from "@/store/custom-data-store";
import type { CustomDataset } from "@/store/custom-data-store";

function makeDataset(id: string, name: string): CustomDataset {
  return {
    schema: {
      id,
      name,
      description: "Test dataset",
      recordCount: 2,
      fields: [{ name: "value", label: "Value", type: "number" }],
    },
    data: [{ value: 1 }, { value: 2 }],
  };
}

beforeEach(() => {
  useCustomDataStore.setState({ datasets: [] });
});

describe("custom-data-store", () => {
  it("starts with no datasets", () => {
    expect(useCustomDataStore.getState().datasets).toHaveLength(0);
  });

  it("addDataset adds a new dataset", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "Sales"));
    expect(useCustomDataStore.getState().datasets).toHaveLength(1);
    expect(useCustomDataStore.getState().datasets[0].schema.name).toBe("Sales");
  });

  it("addDataset replaces dataset with the same id", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "Sales"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "Sales v2"));
    const { datasets } = useCustomDataStore.getState();
    expect(datasets).toHaveLength(1);
    expect(datasets[0].schema.name).toBe("Sales v2");
  });

  it("addDataset preserves other datasets when replacing", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "First"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_2", "Second"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "First Updated"));
    const { datasets } = useCustomDataStore.getState();
    expect(datasets).toHaveLength(2);
    expect(datasets.find((d) => d.schema.id === "ds_2")?.schema.name).toBe("Second");
  });

  it("removeDataset removes the correct dataset", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "First"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_2", "Second"));
    useCustomDataStore.getState().removeDataset("ds_1");
    const { datasets } = useCustomDataStore.getState();
    expect(datasets).toHaveLength(1);
    expect(datasets[0].schema.id).toBe("ds_2");
  });

  it("removeDataset is a no-op for unknown id", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "First"));
    useCustomDataStore.getState().removeDataset("unknown");
    expect(useCustomDataStore.getState().datasets).toHaveLength(1);
  });

  it("can add multiple datasets independently", () => {
    useCustomDataStore.getState().addDataset(makeDataset("ds_1", "A"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_2", "B"));
    useCustomDataStore.getState().addDataset(makeDataset("ds_3", "C"));
    expect(useCustomDataStore.getState().datasets).toHaveLength(3);
  });
});
