import deData from "./de.json";
import type { Factory } from "../types";

type SatisfactoryClass = {
  ClassName: string;
  mDisplayName: string;
};

type SatisfactoryGroup = {
  NativeClass: string;
  Classes: SatisfactoryClass[];
};

const factoryClassNames = [
  "Build_SmelterMk1_C",
  "Build_ConstructorMk1_C",
  "Build_AssemblerMk1_C",
  "Build_ManufacturerMk1_C",
  "Build_Refinery_C",
  "Build_Blender_C",
  "Build_Packager_C",
  "Build_FoundryMk1_C",
];

export const factories: Factory[] = (deData as SatisfactoryGroup[])
  .flatMap((group) => group.Classes)
  .filter((factory) => factoryClassNames.includes(factory.ClassName))
  .map((factory) => ({
    id: factory.ClassName,
    name: factory.mDisplayName,
  }))
  .filter((factory) => factory.name !== "")
  .sort((a, b) => a.name.localeCompare(b.name));