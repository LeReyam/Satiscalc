import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Custom_recipetable from "./custom-recipetable";
import type { Recipe, Item, Factory } from "../types";

const mockItems: Item[] = [
    { id: "item1", name: "Iron Ore" },
    { id: "item2", name: "Iron Plate" },
];

const mockFactories: Factory[] = [
    { id: "factory1", name: "Smelter" },
    { id: "factory2", name: "Assembler" },
];

const mockRecipes: Recipe[] = [
    {
        className: "recipe1",
        name: "Iron Plate Recipe",
        customRecipe: true,
        ingredients: [{ item: "item1", amount: 1 }],
        products: [{ item: "item2", amount: 1 }],
        producedIn: ["factory1"],
        duration: 5,
        inBuildGun: false
    },
];

describe("Custom_recipetable", () => {
    it("renders table with caption", () => {
        const mockCallbacks = {
            onCreateRecipe: vi.fn(),
            onEditRecipe: vi.fn(),
            onDeleteRecipe: vi.fn(),
        };

        render(
            <Custom_recipetable
                recipes={mockRecipes}
                items={mockItems}
                factories={mockFactories}
                {...mockCallbacks}
            />
        );

        expect(screen.getByText("Custom-Rezepte")).toBeInTheDocument();
    });

    it("displays custom recipes in table", () => {
        const mockCallbacks = {
            onCreateRecipe: vi.fn(),
            onEditRecipe: vi.fn(),
            onDeleteRecipe: vi.fn(),
        };

        render(
            <Custom_recipetable
                recipes={mockRecipes}
                items={mockItems}
                factories={mockFactories}
                {...mockCallbacks}
            />
        );

        expect(screen.getByText("Iron Plate Recipe")).toBeInTheDocument();
        expect(screen.getByText("1x Iron Ore")).toBeInTheDocument();
        expect(screen.getByText("1x Iron Plate")).toBeInTheDocument();
    });

    it("shows empty state when no custom recipes exist", () => {
        const mockCallbacks = {
            onCreateRecipe: vi.fn(),
            onEditRecipe: vi.fn(),
            onDeleteRecipe: vi.fn(),
        };

        render(
            <Custom_recipetable
                recipes={[]}
                items={mockItems}
                factories={mockFactories}
                {...mockCallbacks}
            />
        );

        expect(
            screen.getByText("Noch keine eigenen Rezepte vorhanden.")
        ).toBeInTheDocument();
    });

    it("calls onCreateRecipe when create button is clicked", async () => {
        const user = userEvent.setup();
        const onCreateRecipe = vi.fn();

        render(
            <Custom_recipetable
                recipes={[]}
                items={mockItems}
                factories={mockFactories}
                onCreateRecipe={onCreateRecipe}
                onEditRecipe={vi.fn()}
                onDeleteRecipe={vi.fn()}
            />
        );

        await user.click(screen.getByText("Neues Rezept erstellen"));
        expect(onCreateRecipe).toHaveBeenCalledOnce();
    });

    it("calls onEditRecipe with correct className when edit button is clicked", async () => {
        const user = userEvent.setup();
        const onEditRecipe = vi.fn();

        render(
            <Custom_recipetable
                recipes={mockRecipes}
                items={mockItems}
                factories={mockFactories}
                onCreateRecipe={vi.fn()}
                onEditRecipe={onEditRecipe}
                onDeleteRecipe={vi.fn()}
            />
        );

        await user.click(screen.getByText("Bearbeiten"));
        expect(onEditRecipe).toHaveBeenCalledWith("recipe1");
    });

    it("calls onDeleteRecipe with correct className when delete button is clicked", async () => {
        const user = userEvent.setup();
        const onDeleteRecipe = vi.fn();

        render(
            <Custom_recipetable
                recipes={mockRecipes}
                items={mockItems}
                factories={mockFactories}
                onCreateRecipe={vi.fn()}
                onEditRecipe={vi.fn()}
                onDeleteRecipe={onDeleteRecipe}
            />
        );

        await user.click(screen.getByText("Löschen"));
        expect(onDeleteRecipe).toHaveBeenCalledWith("recipe1");
    });

    it("displays factory names correctly", () => {
        render(
            <Custom_recipetable
                recipes={mockRecipes}
                items={mockItems}
                factories={mockFactories}
                onCreateRecipe={vi.fn()}
                onEditRecipe={vi.fn()}
                onDeleteRecipe={vi.fn()}
            />
        );

        expect(screen.getByText("Smelter")).toBeInTheDocument();
    });

    it("filters only custom recipes", () => {
        const mixedRecipes: Recipe[] = [
            ...mockRecipes,
            {
                className: "recipe2",
                name: "Default Recipe",
                customRecipe: false,
                ingredients: [{ item: "item1", amount: 1 }],
                products: [{ item: "item2", amount: 1 }],
                producedIn: ["factory1"],
                duration: 5,
                inBuildGun: false
            },
        ];

        render(
            <Custom_recipetable
                recipes={mixedRecipes}
                items={mockItems}
                factories={mockFactories}
                onCreateRecipe={vi.fn()}
                onEditRecipe={vi.fn()}
                onDeleteRecipe={vi.fn()}
            />
        );

        expect(screen.getByText("Iron Plate Recipe")).toBeInTheDocument();
        expect(screen.queryByText("Default Recipe")).not.toBeInTheDocument();
    });
});