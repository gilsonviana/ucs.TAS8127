import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CategoryEditRow from "../CategoryEditRow";

describe("CategoryEditRow", () => {
  it("renders category name", () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("GPUs")).toBeInTheDocument();
  });

  it("renders edit button", () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("switches to edit mode when edit button is clicked", async () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByDisplayValue("GPUs")).toBeInTheDocument();
  });

  it("shows save and cancel buttons in edit mode", async () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onSave with id and new name when saved", async () => {
    const handleSave = vi.fn();
    render(
      <CategoryEditRow
        id={42}
        name="GPUs"
        onSave={handleSave}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByDisplayValue("GPUs");
    await userEvent.clear(input);
    await userEvent.type(input, "Processors");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(handleSave).toHaveBeenCalledWith(42, "Processors");
  });

  it("calls onDelete when delete button is clicked", async () => {
    const handleDelete = vi.fn();
    render(
      <CategoryEditRow
        id={42}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={handleDelete}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith(42);
  });

  it("cancels edit mode when cancel button is clicked", async () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByDisplayValue("GPUs");
    await userEvent.clear(input);
    await userEvent.type(input, "Changed");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByText("GPUs")).toBeInTheDocument();
  });

  it("saves on Enter key press", async () => {
    const handleSave = vi.fn();
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={handleSave}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByDisplayValue("GPUs");
    await userEvent.clear(input);
    await userEvent.type(input, "NewName");
    await userEvent.keyboard("{Enter}");
    expect(handleSave).toHaveBeenCalledWith(1, "NewName");
  });

  it("cancels on Escape key press", async () => {
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByDisplayValue("GPUs");
    await userEvent.clear(input);
    await userEvent.type(input, "Changed");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByText("GPUs")).toBeInTheDocument();
  });

  it("trims whitespace when saving", async () => {
    const handleSave = vi.fn();
    render(
      <CategoryEditRow
        id={1}
        name="GPUs"
        onSave={handleSave}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByDisplayValue("GPUs");
    await userEvent.clear(input);
    await userEvent.type(input, "  NewName  ");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(handleSave).toHaveBeenCalledWith(1, "NewName");
  });
});
