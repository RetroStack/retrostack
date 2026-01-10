import { renderHook, act } from "@testing-library/react";
import { useOnboarding, OnboardingStep } from "../useOnboarding";
import { IKeyValueStorage } from "@/lib/character-editor/storage/interfaces";

// Mock storage for testing
function createMockStorage(): IKeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

// Sample onboarding steps for testing
const TEST_STEPS: OnboardingStep[] = [
  {
    id: "step1",
    title: "Step 1",
    description: "First step description",
    position: "center",
  },
  {
    id: "step2",
    title: "Step 2",
    description: "Second step description",
    position: "bottom",
  },
  {
    id: "step3",
    title: "Step 3",
    description: "Third step description",
    position: "center",
  },
];

describe("useOnboarding", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isActive).toBe(false);
      expect(result.current.totalSteps).toBe(3);
      expect(result.current.isFirstStep).toBe(true);
      expect(result.current.isLastStep).toBe(false);
      expect(result.current.hasCompleted).toBe(false);
      expect(result.current.hasDismissed).toBe(false);
    });

    it("should return current step data", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      expect(result.current.currentStepData).toEqual(TEST_STEPS[0]);
    });

    it("should auto-start for first-time users when enabled", async () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          enabled: true,
          storage: mockStorage,
        })
      );

      // Should not be active immediately
      expect(result.current.isActive).toBe(false);

      // Advance timers to trigger auto-start
      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.isActive).toBe(true);
    });

    it("should not auto-start when disabled", async () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          enabled: false,
          storage: mockStorage,
        })
      );

      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.isActive).toBe(false);
    });

    it("should not auto-start if already completed", async () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(
        "retrostack-character-editor-onboarding",
        JSON.stringify({
          completed: true,
          dismissed: false,
          updatedAt: Date.now(),
        })
      );

      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          enabled: true,
          storage: mockStorage,
        })
      );

      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.hasCompleted).toBe(true);
    });

    it("should not auto-start if previously dismissed", async () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(
        "retrostack-character-editor-onboarding",
        JSON.stringify({
          completed: false,
          dismissed: true,
          updatedAt: Date.now(),
        })
      );

      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          enabled: true,
          storage: mockStorage,
        })
      );

      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.hasDismissed).toBe(true);
    });
  });

  describe("navigation", () => {
    it("should start the tour manually", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.currentStep).toBe(0);
    });

    it("should go to the next step", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.next();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.currentStepData).toEqual(TEST_STEPS[1]);
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(false);
    });

    it("should go to the previous step", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.next();
        result.current.next();
      });

      expect(result.current.currentStep).toBe(2);

      act(() => {
        result.current.prev();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should not go before the first step", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.prev();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isFirstStep).toBe(true);
    });

    it("should complete the tour on the last step", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.next(); // Step 2
      });

      act(() => {
        result.current.next(); // Step 3 (last step)
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.isLastStep).toBe(true);

      act(() => {
        result.current.next(); // Complete
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.hasCompleted).toBe(true);
      expect(result.current.shouldShowAutomatically).toBe(false);

      // Check storage was updated
      const stored = JSON.parse(
        mockStorage.getItem("retrostack-character-editor-onboarding") || "{}"
      );
      expect(stored.completed).toBe(true);
      expect(stored.dismissed).toBe(false);
    });
  });

  describe("skip/dismiss", () => {
    it("should skip the tour and mark as dismissed", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.skip();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.hasDismissed).toBe(true);
      expect(result.current.hasCompleted).toBe(false);

      // Check storage was updated
      const stored = JSON.parse(
        mockStorage.getItem("retrostack-character-editor-onboarding") || "{}"
      );
      expect(stored.dismissed).toBe(true);
      expect(stored.completed).toBe(false);
    });
  });

  describe("complete", () => {
    it("should complete the tour manually", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.complete();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.hasCompleted).toBe(true);
      expect(result.current.hasDismissed).toBe(false);
    });
  });

  describe("reset", () => {
    it("should reset the tour to initial state", () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(
        "retrostack-character-editor-onboarding",
        JSON.stringify({
          completed: true,
          dismissed: false,
          updatedAt: Date.now(),
        })
      );

      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.hasCompleted).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.hasCompleted).toBe(false);
      expect(result.current.hasDismissed).toBe(false);
      expect(result.current.shouldShowAutomatically).toBe(true);

      // Check storage was updated
      const stored = JSON.parse(
        mockStorage.getItem("retrostack-character-editor-onboarding") || "{}"
      );
      expect(stored.completed).toBe(false);
      expect(stored.dismissed).toBe(false);
    });
  });

  describe("shouldShowAutomatically", () => {
    it("should be true for new users", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      expect(result.current.shouldShowAutomatically).toBe(true);
    });

    it("should be false after completion", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.complete();
      });

      expect(result.current.shouldShowAutomatically).toBe(false);
    });

    it("should be false after dismissal", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: TEST_STEPS,
          storage: mockStorage,
        })
      );

      act(() => {
        result.current.start();
        result.current.skip();
      });

      expect(result.current.shouldShowAutomatically).toBe(false);
    });
  });

  describe("empty steps", () => {
    it("should handle empty steps array", () => {
      const mockStorage = createMockStorage();
      const { result } = renderHook(() =>
        useOnboarding({
          steps: [],
          storage: mockStorage,
        })
      );

      expect(result.current.totalSteps).toBe(0);
      expect(result.current.currentStepData).toBeNull();
      expect(result.current.isFirstStep).toBe(true);
      // With 0 steps, isLastStep is false (currentStep 0 !== -1)
      // This is correct behavior - there is no "last step" with empty steps
      expect(result.current.isLastStep).toBe(false);
    });
  });
});
