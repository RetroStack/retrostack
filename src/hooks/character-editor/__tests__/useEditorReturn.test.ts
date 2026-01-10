import { renderHook } from "@testing-library/react";
import { useEditorReturn } from "@/hooks/character-editor/useEditorReturn";

// Mock next/navigation
const mockGet = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("useEditorReturn", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  describe("when not from editor", () => {
    it("returns default back URL when no params", () => {
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe("/tools/character-rom-editor");
      expect(result.current.backLabel).toBe("Back to Library");
      expect(result.current.isFromEditor).toBe(false);
      expect(result.current.editId).toBeNull();
    });

    it("returns default back URL when only from=editor (no editId)", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "from") return "editor";
        if (key === "editId") return null;
        return null;
      });

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe("/tools/character-rom-editor");
      expect(result.current.backLabel).toBe("Back to Library");
      expect(result.current.isFromEditor).toBe(false);
    });

    it("returns default back URL when only editId (no from)", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "from") return null;
        if (key === "editId") return "abc123";
        return null;
      });

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe("/tools/character-rom-editor");
      expect(result.current.backLabel).toBe("Back to Library");
      expect(result.current.isFromEditor).toBe(false);
    });

    it("returns custom default back URL when provided", () => {
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() =>
        useEditorReturn({ defaultBackUrl: "/custom/path" })
      );

      expect(result.current.backUrl).toBe("/custom/path");
    });

    it("returns custom default back label when provided", () => {
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() =>
        useEditorReturn({ defaultBackLabel: "Go Back" })
      );

      expect(result.current.backLabel).toBe("Go Back");
    });

    it("buildEditorReturnParams returns empty string when not from editor", () => {
      mockGet.mockReturnValue(null);

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.buildEditorReturnParams()).toBe("");
    });
  });

  describe("when from editor", () => {
    beforeEach(() => {
      mockGet.mockImplementation((key: string) => {
        if (key === "from") return "editor";
        if (key === "editId") return "abc123";
        return null;
      });
    });

    it("returns editor URL with editId", () => {
      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe(
        "/tools/character-rom-editor/edit?id=abc123"
      );
    });

    it("returns 'Back to Editor' label", () => {
      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backLabel).toBe("Back to Editor");
    });

    it("sets isFromEditor to true", () => {
      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.isFromEditor).toBe(true);
    });

    it("returns editId", () => {
      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.editId).toBe("abc123");
    });

    it("buildEditorReturnParams returns correct query string", () => {
      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.buildEditorReturnParams()).toBe(
        "from=editor&editId=abc123"
      );
    });

    it("ignores custom default options when from editor", () => {
      const { result } = renderHook(() =>
        useEditorReturn({
          defaultBackUrl: "/custom/path",
          defaultBackLabel: "Go Back",
        })
      );

      expect(result.current.backUrl).toBe(
        "/tools/character-rom-editor/edit?id=abc123"
      );
      expect(result.current.backLabel).toBe("Back to Editor");
    });
  });

  describe("with different editId values", () => {
    it("handles UUID-style editId", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "from") return "editor";
        if (key === "editId") return "550e8400-e29b-41d4-a716-446655440000";
        return null;
      });

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe(
        "/tools/character-rom-editor/edit?id=550e8400-e29b-41d4-a716-446655440000"
      );
      expect(result.current.buildEditorReturnParams()).toBe(
        "from=editor&editId=550e8400-e29b-41d4-a716-446655440000"
      );
    });

    it("handles short editId", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "from") return "editor";
        if (key === "editId") return "x";
        return null;
      });

      const { result } = renderHook(() => useEditorReturn());

      expect(result.current.backUrl).toBe(
        "/tools/character-rom-editor/edit?id=x"
      );
    });
  });
});
