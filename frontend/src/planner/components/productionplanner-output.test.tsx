import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import Productionplanner_output from "./productionplanner-output";
import type { ProductionPlan } from "../planner-types";

// CSS side-effect import — no-op in tests
vi.mock("./productionplanner-output.css", () => ({}));

const buildPlan = (overrides?: Partial<ProductionPlan>): ProductionPlan =>
  ({
    rootProductId: "item-root",
    rootProductName: "Iron Plate",
    targetAmountPerMinute: 30,
    baseResources: [
      { itemId: "item-iron-ore", itemName: "Iron Ore", amountPerMinute: 45 },
      { itemId: "item-limestone", itemName: "Limestone", amountPerMinute: 15 },
    ],
    intermediateResources: [
      {
        itemId: "item-iron-ingot",
        itemName: "Iron Ingot",
        amountPerMinute: 30,
      },
    ],
    machines: [
      {
        recipeId: "recipe-smelt-iron",
        outputItemId: "item-iron-ingot",
        factoryName: "Smelter",
        machines: 1.5,
      },
      {
        recipeId: "recipe-plate-iron",
        outputItemId: "item-iron-plate",
        factoryName: "Constructor",
        machines: 2,
      },
    ],
    ...overrides,
  }) as ProductionPlan;

const getTableByHeading = (headingText: string) => {
  const heading = screen.getByRole("heading", { name: headingText });
  // The table is the next sibling element following the <h3>
  const table = heading.nextElementSibling;
  if (!table || table.tagName !== "TABLE") {
    throw new Error(`No table found after heading "${headingText}"`);
  }
  return table as HTMLTableElement;
};

describe("Productionplanner_output", () => {
  it("renders the section title and target line", () => {
    render(<Productionplanner_output plan={buildPlan()} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Produktion" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Ziel" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/30\.00 \/ min/)).toBeInTheDocument();
    expect(screen.getByText(/Iron Plate/)).toBeInTheDocument();
  });

  it("formats the target amount to two decimal places", () => {
    render(
      <Productionplanner_output
        plan={buildPlan({ targetAmountPerMinute: 12.3456 })}
      />,
    );
    expect(screen.getByText(/12\.35 \/ min/)).toBeInTheDocument();
  });

  it("renders a row per base resource with formatted amounts", () => {
    render(<Productionplanner_output plan={buildPlan()} />);

    const table = getTableByHeading("Basis-Ressourcen");
    const rows = within(table).getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);

    expect(within(table).getByText("Iron Ore")).toBeInTheDocument();
    expect(within(table).getByText("45.00")).toBeInTheDocument();
    expect(within(table).getByText("Limestone")).toBeInTheDocument();
    expect(within(table).getByText("15.00")).toBeInTheDocument();
  });

  it("renders a row per intermediate resource with formatted amounts", () => {
    render(<Productionplanner_output plan={buildPlan()} />);

    const table = getTableByHeading("Zwischenprodukte");
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(2); // header + 1 data row

    expect(within(table).getByText("Iron Ingot")).toBeInTheDocument();
    expect(within(table).getByText("30.00")).toBeInTheDocument();
  });

  it("renders a row per machine with formatted machine counts", () => {
    render(<Productionplanner_output plan={buildPlan()} />);

    const table = getTableByHeading("Maschinen");
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3); // header + 2 data rows

    expect(within(table).getByText("Smelter")).toBeInTheDocument();
    expect(within(table).getByText("1.50")).toBeInTheDocument();
    expect(within(table).getByText("Constructor")).toBeInTheDocument();
    expect(within(table).getByText("2.00")).toBeInTheDocument();
  });

  it("renders header-only tables when a resource list is empty", () => {
    render(
      <Productionplanner_output
        plan={buildPlan({
          baseResources: [],
          intermediateResources: [],
          machines: [],
        })}
      />,
    );

    for (const heading of ["Basis-Ressourcen", "Zwischenprodukte", "Maschinen"]) {
      const table = getTableByHeading(heading);
      const rows = within(table).getAllByRole("row");
      expect(rows).toHaveLength(1); // header row only, no data rows
    }
  });

  it("uses a stable, unique key derived from recipeId + outputItemId for machine rows (no React key warnings)", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <Productionplanner_output
        plan={buildPlan({
          machines: [
            {
              recipeId: "recipe-a",
              outputItemId: "item-a",
              factoryName: "Factory A",
              machines: 1,
            },
            {
              recipeId: "recipe-b",
              outputItemId: "item-a",
              factoryName: "Factory B",
              machines: 2,
            },
          ] as ProductionPlan["machines"],
        })}
      />,
    );

    const keyWarning = consoleErrorSpy.mock.calls.some((call) =>
      String(call[0]).includes("unique") && String(call[0]).includes("key"),
    );
    expect(keyWarning).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it("renders correct table headers for each section", () => {
    render(<Productionplanner_output plan={buildPlan()} />);

    const baseTable = getTableByHeading("Basis-Ressourcen");
    expect(within(baseTable).getByText("Ressource")).toBeInTheDocument();
    expect(within(baseTable).getByText("/ min")).toBeInTheDocument();

    const intermediateTable = getTableByHeading("Zwischenprodukte");
    expect(within(intermediateTable).getByText("Produkt")).toBeInTheDocument();
    expect(within(intermediateTable).getByText("/ min")).toBeInTheDocument();

    const machinesTable = getTableByHeading("Maschinen");
    expect(within(machinesTable).getByText("Fabrik")).toBeInTheDocument();
    expect(within(machinesTable).getByText("Anzahl")).toBeInTheDocument();
  });
});