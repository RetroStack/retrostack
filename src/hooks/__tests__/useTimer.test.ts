import { renderHook, act } from "@testing-library/react";
import { useTimer, useInterval } from "../useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with isActive as false", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.isActive).toBe(false);
  });

  it("executes callback after delay", () => {
    const { result } = renderHook(() => useTimer());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("sets isActive to true when timer is set", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.set(() => {}, 1000);
    });

    expect(result.current.isActive).toBe(true);
  });

  it("sets isActive to false after timer fires", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.set(() => {}, 1000);
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isActive).toBe(false);
  });

  it("clears timer when clear() is called", () => {
    const { result } = renderHook(() => useTimer());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.isActive).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("clears existing timer when set() is called again", () => {
    const { result } = renderHook(() => useTimer());
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    act(() => {
      result.current.set(callback1, 1000);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.set(callback2, 1000);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("clears timer on unmount", () => {
    const { result, unmount } = renderHook(() => useTimer());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("returns stable function references", () => {
    const { result, rerender } = renderHook(() => useTimer());

    const initialSet = result.current.set;
    const initialClear = result.current.clear;

    rerender();

    expect(result.current.set).toBe(initialSet);
    expect(result.current.clear).toBe(initialClear);
  });
});

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with isActive as false", () => {
    const { result } = renderHook(() => useInterval());
    expect(result.current.isActive).toBe(false);
  });

  it("executes callback repeatedly at interval", () => {
    const { result } = renderHook(() => useInterval());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("stops repeating when clear() is called", () => {
    const { result } = renderHook(() => useInterval());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.clear();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(callback).toHaveBeenCalledTimes(2); // Still 2, not increased
  });

  it("clears interval on unmount", () => {
    const { result, unmount } = renderHook(() => useInterval());
    const callback = jest.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(callback).toHaveBeenCalledTimes(1); // Still 1, not increased
  });
});
