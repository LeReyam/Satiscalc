import fs from "node:fs";

const deData = JSON.parse(fs.readFileSync("./src/data/rawdata/de.json", "utf8"));

const itemGroup = deData.find((group) =>
  group.NativeClass.includes("FGItemDescriptor")
);

if (!itemGroup) {
  throw new Error("FGItemDescriptor nicht gefunden");
}

const items = itemGroup.Classes
  .map((item) => ({
    id: item.ClassName,
    name: item.mDisplayName,
  }))
  .filter((item) => item.name && item.name.trim() !== "")
  .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync("./src/data/items.json", JSON.stringify(items, null, 2), "utf8");

// ----------------------
// FACTORIES
// ----------------------

const manufacturerGroup = deData.find((group) =>
  group.NativeClass.includes("FGBuildableManufacturer")
);

if (!manufacturerGroup) {
  throw new Error("FGBuildableManufacturer nicht gefunden");
}

const factoryDefinitions = [
  {
    id: "Desc_SmelterMk1_C",
    lookupId: "Build_SmelterMk1_C",
    inputSlots: 1,
    outputSlots: 1,
    powerConsumption: 4,
  },
  {
    id: "Desc_ConstructorMk1_C",
    lookupId: "Build_ConstructorMk1_C",
    inputSlots: 1,
    outputSlots: 1,
    powerConsumption: 4,
  },
  {
    id: "Desc_AssemblerMk1_C",
    lookupId: "Build_AssemblerMk1_C",
    inputSlots: 2,
    outputSlots: 1,
    powerConsumption: 15,
  },
  {
    id: "Desc_FoundryMk1_C",
    lookupId: "Build_FoundryMk1_C",
    inputSlots: 2,
    outputSlots: 1,
    powerConsumption: 16,
  },
  {
    id: "Desc_ManufacturerMk1_C",
    lookupId: "Build_ManufacturerMk1_C",
    inputSlots: 4,
    outputSlots: 1,
    powerConsumption: 55,
  },
  {
    id: "Desc_OilRefinery_C",
    lookupId: "Build_OilRefinery_C",
    inputSlots: 2,
    outputSlots: 2,
    powerConsumption: 30,
  },
  {
    id: "Desc_Blender_C",
    lookupId: "Build_Blender_C",
    inputSlots: 4,
    outputSlots: 2,
    powerConsumption: 75,
  },
  {
    id: "Desc_Packager_C",
    lookupId: "Build_Packager_C",
    inputSlots: 2,
    outputSlots: 2,
    powerConsumption: 10,
  },
];

const factories = factoryDefinitions.map((factory) => {
  const manufacturer = manufacturerGroup.Classes.find(
    (manufacturer) => manufacturer.ClassName === factory.lookupId
  );

  return {
    id: factory.id,
    name: manufacturer?.mDisplayName ?? factory.id,
    inputSlots: factory.inputSlots,
    outputSlots: factory.outputSlots,
    powerConsumption: factory.powerConsumption,
  };
});

fs.writeFileSync(
  "./src/data/factories.json",
  JSON.stringify(factories, null, 2),
  "utf8"
);

console.log(`✓ ${items.length} Items exportiert`);
console.log(`✓ ${factories.length} Fabriken exportiert`);