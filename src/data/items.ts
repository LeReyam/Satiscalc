import deData from "./de.json";
import type { Item } from "../types";

type SatisfactoryClass = {
  ClassName: string;
  mDisplayName: string;
};

type SatisfactoryGroup = {
  NativeClass: string;
  Classes: SatisfactoryClass[];
};

export const items: Item[] = (deData as SatisfactoryGroup[])
  .find((group) => group.NativeClass.includes("FGItemDescriptor"))
  ?.Classes.map((item) => ({
    id: item.ClassName,
    name: item.mDisplayName,
  }))
  .filter((item) => item.name !== "") ?? [];