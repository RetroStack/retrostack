import { renderHook, act } from "@testing-library/react";
import { useModalManager } from "../useModalManager";

type TestModals = "settings" | "export" | "help" | "confirm";

describe("useModalManager", () => {
  it("initializes with no modal open", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    expect(result.current.activeModal).toBe(null);
    expect(result.current.isOpen("settings")).toBe(false);
    expect(result.current.isOpen("export")).toBe(false);
  });

  it("can initialize with a specific modal open", () => {
    const { result } = renderHook(() =>
      useModalManager<TestModals>({ initialModal: "settings" })
    );

    expect(result.current.activeModal).toBe("settings");
    expect(result.current.isOpen("settings")).toBe(true);
    expect(result.current.isOpen("export")).toBe(false);
  });

  it("opens a modal when open() is called", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
    });

    expect(result.current.activeModal).toBe("settings");
    expect(result.current.isOpen("settings")).toBe(true);
  });

  it("closes the current modal and opens new one (single modal enforcement)", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
    });
    expect(result.current.isOpen("settings")).toBe(true);

    act(() => {
      result.current.open("export");
    });

    expect(result.current.activeModal).toBe("export");
    expect(result.current.isOpen("settings")).toBe(false);
    expect(result.current.isOpen("export")).toBe(true);
  });

  it("closes a modal when close() is called", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
    });
    expect(result.current.isOpen("settings")).toBe(true);

    act(() => {
      result.current.close("settings");
    });

    expect(result.current.activeModal).toBe(null);
    expect(result.current.isOpen("settings")).toBe(false);
  });

  it("only closes the modal if it matches the key", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
    });

    // Try to close a different modal
    act(() => {
      result.current.close("export");
    });

    // Settings should still be open
    expect(result.current.activeModal).toBe("settings");
    expect(result.current.isOpen("settings")).toBe(true);
  });

  it("closes all modals when closeAll() is called", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
    });
    expect(result.current.isOpen("settings")).toBe(true);

    act(() => {
      result.current.closeAll();
    });

    expect(result.current.activeModal).toBe(null);
    expect(result.current.isOpen("settings")).toBe(false);
  });

  it("isOpen returns correct value for each modal", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("help");
    });

    expect(result.current.isOpen("settings")).toBe(false);
    expect(result.current.isOpen("export")).toBe(false);
    expect(result.current.isOpen("help")).toBe(true);
    expect(result.current.isOpen("confirm")).toBe(false);
  });

  it("returns stable function references", () => {
    const { result, rerender } = renderHook(() => useModalManager<TestModals>());

    const initialOpen = result.current.open;
    const initialClose = result.current.close;
    const initialCloseAll = result.current.closeAll;

    rerender();

    expect(result.current.open).toBe(initialOpen);
    expect(result.current.close).toBe(initialClose);
    expect(result.current.closeAll).toBe(initialCloseAll);
  });

  it("updates isOpen reference when activeModal changes", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    const initialIsOpen = result.current.isOpen;

    act(() => {
      result.current.open("settings");
    });

    // isOpen should be a new reference since it depends on activeModal
    expect(result.current.isOpen).not.toBe(initialIsOpen);
  });

  it("handles rapid open/close cycles correctly", () => {
    const { result } = renderHook(() => useModalManager<TestModals>());

    act(() => {
      result.current.open("settings");
      result.current.close("settings");
      result.current.open("export");
      result.current.open("help");
      result.current.close("export"); // Should not close since help is open
    });

    expect(result.current.activeModal).toBe("help");
    expect(result.current.isOpen("help")).toBe(true);
  });
});
