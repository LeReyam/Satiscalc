import { describe, it, expect, vi, beforeEach } from "vitest";

import { calculateProductionPlan } from "./calculate-production-plan";
import type { Factory, Item, Recipe } from "../../types";

// --- Mocks for the pure helper functions ------------------------------
// calculateProductionPlan is a thin orchestrator: build a tree, then
// derive the plan's sub-lists from it. We mock all of that out so these
// tests only cover the orchestration logic itself (what gets passed to
// whom, and how the final ProductionPlan is assembled).

const calculateProductionTreeMock = vi.fn();
const collectBaseResourcesMock = vi.fn();
const collectIntermediateResourcesMock = vi.fn();
const collectMachinesMock = vi.fn();

vi.mock("./calculate-production-tree", () => ({
  calculateProductionTree: (...args: any[]) =>
    calculateProductionTreeMock(...args),
}));

vi.mock("./collect-resources", () => ({
  collectBaseResources: (...args: any[]) => collectBaseResourcesMock(...args),
  collectIntermediateResources: (...args: any[]) =>
    collectIntermediateResourcesMock(...args),
}));

vi.mock("./collect-machines", () => ({
  collectMachines: (...args: any[]) => collectMachinesMock(...args),
}));

// --- Fixtures -----------------------------------------------------------

const items: Item[] = [
  { id: "item-iron-plate", name: "Iron Plate" } as Item,
  { id: "item-iron-ingot", name: "Iron Ingot" } as Item,
];

const recipes: Recipe[] = [] as Recipe[];
const factories: Factory[] = [] as Factory[];

const buildRecipe = (overrides?: Partial<Recipe>): Recipe =>
  ({
    id: "recipe-iron-plate",
    name: "Iron Plate",
    products: [{ item: "item-iron-plate", amount: 20 }],
    ingredients: [],
    ...overrides,
  }) as Recipe;

const fakeTree = { productId: "item-iron-plate", children: [] };

describe("calculateProductionPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calculateProductionTreeMock.mockReturnValue(fakeTree);
    collectBaseResourcesMock.mockReturnValue([]);
    collectIntermediateResourcesMock.mockReturnValue([]);
    collectMachinesMock.mockReturnValue([]);
  });

  it("derives rootProductId/rootProductName from the recipe's first product", () => {
    const recipe = buildRecipe();

    const plan = calculateProductionPlan({
      recipe,
      amountPerMinute: 30,
      recipes,
      items,
      factories,
    });

    expect(plan.rootProductId).toBe("item-iron-plate");
    expect(plan.rootProductName).toBe("Iron Plate");
  });

  it("falls back to the raw item id as the name when the item isn't found", () => {
    const recipe = buildRecipe({
      products: [{ item: "item-unknown", amount: 1 }],
    } as Partial<Recipe>);

    const plan = calculateProductionPlan({
      recipe,
      amountPerMinute: 10,
      recipes,
      items,
      factories,
    });

    expect(plan.rootProductId).toBe("item-unknown");
    expect(plan.rootProductName).toBe("item-unknown");
  });

  it("uses an empty string as the root product id when the recipe has no products", () => {
    const recipe = buildRecipe({ products: [] } as Partial<Recipe>);

    const plan = calculateProductionPlan({
      recipe,
      amountPerMinute: 10,
      recipes,
      items,
      factories,
    });

    expect(plan.rootProductId).toBe("");
    expect(plan.rootProductName).toBe("");
  });

  it("calls calculateProductionTree with the resolved productId and the passed-through params", () => {
    const recipe = buildRecipe();

    calculateProductionPlan({
      recipe,
      amountPerMinute: 45,
      recipes,
      items,
      factories,
    });

    expect(calculateProductionTreeMock).toHaveBeenCalledWith({
      productId: "item-iron-plate",
      amountPerMinute: 45,
      recipes,
      items,
      factories,
    });
  });

  it("passes the computed tree to each of the collection helpers", () => {
    const recipe = buildRecipe();

    calculateProductionPlan({
      recipe,
      amountPerMinute: 45,
      recipes,
      items,
      factories,
    });

    expect(collectBaseResourcesMock).toHaveBeenCalledWith(fakeTree);
    expect(collectIntermediateResourcesMock).toHaveBeenCalledWith(fakeTree);
    expect(collectMachinesMock).toHaveBeenCalledWith(fakeTree);
  });

  it("assembles the final ProductionPlan from all computed pieces", () => {
    const recipe = buildRecipe();
    const baseResources = [
      { itemId: "item-iron-ore", itemName: "Iron Ore", amountPerMinute: 30 },
    ];
    const intermediateResources = [
      {
        itemId: "item-iron-ingot",
        itemName: "Iron Ingot",
        amountPerMinute: 20,
      },
    ];
    const machines = [
      {
        recipeId: "recipe-iron-plate",
        outputItemId: "item-iron-plate",
        factoryName: "Constructor",
        machines: 1.5,
      },
    ];

    collectBaseResourcesMock.mockReturnValue(baseResources);
    collectIntermediateResourcesMock.mockReturnValue(intermediateResources);
    collectMachinesMock.mockReturnValue(machines);

    const plan = calculateProductionPlan({
      recipe,
      amountPerMinute: 20,
      recipes,
      items,
      factories,
    });

    expect(plan).toEqual({
      rootProductId: "item-iron-plate",
      rootProductName: "Iron Plate",
      targetAmountPerMinute: 20,
      baseResources,
      intermediateResources,
      machines,
      tree: fakeTree,
    });
  });

  it("passes through the given amountPerMinute as targetAmountPerMinute unchanged", () => {
    const recipe = buildRecipe();

    const plan = calculateProductionPlan({
      recipe,
      amountPerMinute: 123.456,
      recipes,
      items,
      factories,
    });

    expect(plan.targetAmountPerMinute).toBe(123.456);
  });

  it("forwards the recipes/items/factories lists unmodified to calculateProductionTree", () => {
    const recipe = buildRecipe();
    const customRecipes = [
      buildRecipe({ id: "other-recipe" } as Partial<Recipe>),
    ];
    const customItems = [{ id: "item-x", name: "X" } as Item];
    const customFactories = [{ id: "factory-x", name: "Factory X" } as Factory];

    calculateProductionPlan({
      recipe,
      amountPerMinute: 10,
      recipes: customRecipes,
      items: customItems,
      factories: customFactories,
    });

    expect(calculateProductionTreeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        recipes: customRecipes,
        items: customItems,
        factories: customFactories,
      }),
    );
  });
});