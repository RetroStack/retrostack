import { renderHook, act } from "@testing-library/react";
import { useDropdown } from "../useDropdown";

// Mock useOutsideClick
jest.mock("../useOutsideClick", () => ({
  useOutsideClick: jest.fn((callback, enabled) => {
    // Store the callback so tests can trigger it
    (global as { __outsideClickCallback?: () => void }).__outsideClickCallback = enabled ? callback : undefined;
    return { current: null };
  }),
}));

describe("useDropdown", () => {
  beforeEach(() => {
    (global as { __outsideClickCallback?: () => void }).__outsideClickCallback = undefined;
  });

  it("initializes with isOpen as false", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.isOpen).toBe(false);
  });

  it("opens dropdown when open() is called", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("closes dropdown when close() is called", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("toggles dropdown state when toggle() is called", () => {
    const { result } = renderHook(() => useDropdown());

    // Initially closed
    expect(result.current.isOpen).toBe(false);

    // Toggle to open
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle to closed
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("provides a ref object", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.ref).toHaveProperty("current");
  });

  it("closes when outside click is triggered", () => {
    const { result } = renderHook(() => useDropdown());

    // Open the dropdown
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // Simulate outside click
    act(() => {
      const callback = (global as { __outsideClickCallback?: () => void }).__outsideClickCallback;
      if (callback) callback();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("returns stable function references", () => {
    const { result, rerender } = renderHook(() => useDropdown());

    const initialToggle = result.current.toggle;
    const initialOpen = result.current.open;
    const initialClose = result.current.close;

    rerender();

    expect(result.current.toggle).toBe(initialToggle);
    expect(result.current.open).toBe(initialOpen);
    expect(result.current.close).toBe(initialClose);
  });
});
