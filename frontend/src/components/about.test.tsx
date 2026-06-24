// planner.test.tsx

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import About, { BackendTest } from "./about";




vi.mock("../about.css", () => ({}));


describe("About Komponente", () => {
  it("rendert die About-Komponente korrekt", () => {
    render(<About />);
    expect(screen.getByText("Unser Projekt")).toBeInTheDocument();
  })

vi.mock("./about.css", () => ({}));

describe("About Komponente", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("rendert die About-Komponente korrekt", () => {
        render(<About />);
        expect(screen.getByText("Unser Projekt")).toBeInTheDocument();
    });

    it("zeigt Backend-Status bei erfolgreichem Fetch", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ ok: true, message: "Backend OK" }),
            })
        ));
        render(<BackendTest />);
        expect(await screen.findByText("Backend OK")).toBeInTheDocument();
    });

    it("zeigt Fehlertext bei fehlgeschlagenem Fetch", async () => {
        vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("net error"))));
        render(<BackendTest />);
        expect(await screen.findByText(/Fehler: net error/)).toBeInTheDocument();
    });
});
});
