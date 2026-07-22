import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Custom_recipe_editor from "./custom-recipe-editor";
import type { Recipe, Item, Factory } from "../types";

const mockItems: Item[] = [
    { id: "iron_ore", name: "Iron Ore" },
    { id: "iron_plate", name: "Iron Plate" },
    { id: "copper_ore", name: "Copper Ore" },
];

const mockFactories: Factory[] = [
    { id: "smelter", name: "Smelter" },
    { id: "constructor", name: "Constructor" },
];

const mockRecipe: Recipe = {
    className: "recipe1",
    name: "Iron Unsmelting",
    duration: 2,
    ingredients: [{ item: "iron_plate", amount: 1 }],
    products: [{ item: "iron_ore", amount: 1 }],
    producedIn: ["smelter"],
    customRecipe: true,
    inBuildGun: false,
};

describe("Custom Recipe Editor", () => {
    it("renders form for creating new recipe", () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        expect(screen.getByText("Neues Rezept erstellen")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Rezept erstellen/ })).toBeInTheDocument();
    });

    it("renders form for editing existing recipe", () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();

        render(
            <Custom_recipe_editor
                recipe={mockRecipe}
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        expect(screen.getByText("Rezept bearbeiten")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Änderungen speichern/ })).toBeInTheDocument();
    });

    it("populates form fields with existing recipe data", () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();

        render(
            <Custom_recipe_editor
                recipe={mockRecipe}
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        expect(screen.getByDisplayValue("Iron Unsmelting")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });

    it("shows validation errors when required fields are empty", async () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        const submitButton = screen.getByRole("button", { name: /Rezept erstellen/ });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Bitte alle Pflichtfelder ausfüllen.")).toBeInTheDocument();
        });
        expect(onSave).not.toHaveBeenCalled();
    });

    it("calls onSave with correct recipe data on submit", async () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        await user.type(screen.getByPlaceholderText("Mein Rezept"), "Test Recipe");
        await user.selectOptions(screen.getAllByRole("combobox")[0], "iron_ore");
        await user.selectOptions(screen.getAllByRole("combobox")[1], "iron_plate");
        await user.selectOptions(screen.getAllByRole("combobox")[2], "smelter");

        const submitButton = screen.getByRole("button", { name: /Rezept erstellen/ });
        await user.click(submitButton);

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
                name: "Test Recipe",
                ingredients: [{ item: "iron_ore", amount: 1 }],
                products: [{ item: "iron_plate", amount: 1 }],
                producedIn: ["smelter"],
            }));
        });
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        await user.click(screen.getByRole("button", { name: /Zurück/ }));

        expect(onCancel).toHaveBeenCalled();
    });

    it("uses item name as recipe name when name is empty", async () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        await user.selectOptions(screen.getAllByRole("combobox")[1], "iron_plate");
        await user.selectOptions(screen.getAllByRole("combobox")[0], "iron_ore");
        await user.selectOptions(screen.getAllByRole("combobox")[2], "smelter");

        await user.click(screen.getByRole("button", { name: /Rezept erstellen/ }));

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
                name: "Iron Plate",
            }));
        });
    });

    it("updates input and output amounts correctly", async () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <Custom_recipe_editor
                items={mockItems}
                factories={mockFactories}
                onSave={onSave}
                onCancel={onCancel}
            />
        );

        const inputs = screen.getAllByRole("spinbutton");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "5");
        await user.clear(inputs[1]);
        await user.type(inputs[1], "10");

        await user.selectOptions(screen.getAllByRole("combobox")[0], "iron_ore");
        await user.selectOptions(screen.getAllByRole("combobox")[1], "iron_plate");
        await user.selectOptions(screen.getAllByRole("combobox")[2], "smelter");

        await user.click(screen.getByRole("button", { name: /Rezept erstellen/ }));

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
                ingredients: [{ item: "iron_ore", amount: 5 }],
                products: [{ item: "iron_plate", amount: 10 }],
            }));
        });
    });
});