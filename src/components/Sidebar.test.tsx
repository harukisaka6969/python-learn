import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProgressProvider } from "../progress/ProgressProvider";
import { CHAPTERS } from "../content/index";

describe("Sidebar", () => {
  it("全章のタイトルを表示する", () => {
    render(
      <MemoryRouter>
        <ProgressProvider>
          <Sidebar open={false} />
        </ProgressProvider>
      </MemoryRouter>
    );
    for (const chapter of CHAPTERS) {
      expect(screen.getByText(chapter.title)).toBeInTheDocument();
    }
  });

  it("最初のレッスンへのリンクを持つ", () => {
    render(
      <MemoryRouter>
        <ProgressProvider>
          <Sidebar open={false} />
        </ProgressProvider>
      </MemoryRouter>
    );
    const firstLesson = CHAPTERS[0].lessons[0];
    const link = screen.getByText(firstLesson.title).closest("a");
    expect(link).toHaveAttribute("href", `/lesson/${firstLesson.id}`);
  });
});
