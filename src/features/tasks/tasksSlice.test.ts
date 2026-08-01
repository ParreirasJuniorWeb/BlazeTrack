import reducer, {
    setFilter,
    clearTasksError,
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskStatus,
    selectFilteredTasks,
    selectTaskMetrics,
} from "./tasksSlice";
import { TasksState, ITask } from "./types";

type SliceRootState = { tasks: TasksState };

const makeTask = (overrides: Partial<ITask> = {}): ITask => ({
    id: "1",
    userId: "u1",
    title: "Task",
    description: "Desc",
    status: "stopped",
    isPublic: false,
    deadline: null,
    pomodoroTimeSpent: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

describe("tasksSlice", () => {
    const initialState: TasksState = {
        items: [],
        isLoading: false,
        isSubmitting: false,
        error: null,
        filter: "all",
    };

    it("should return initial state", () => {
        const state = reducer(undefined, { type: "unknown" });
        expect(state).toEqual(initialState);
    });

    it("should handle setFilter", () => {
        const state = reducer(initialState, setFilter("done"));
        expect(state.filter).toBe("done");
    });

    it("should handle clearTasksError", () => {
        const stateWithError: TasksState = { ...initialState, error: "erro" };
        const state = reducer(stateWithError, clearTasksError());
        expect(state.error).toBeNull();
    });

    it("should handle fetchTasks.pending", () => {
        const state = reducer(initialState, { type: fetchTasks.pending.type });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("should handle fetchTasks.fulfilled", () => {
        const payload = [makeTask({ id: "a" }), makeTask({ id: "b" })];
        const state = reducer(initialState, {
            type: fetchTasks.fulfilled.type,
            payload,
        });
        expect(state.isLoading).toBe(false);
        expect(state.items).toHaveLength(2);
    });

    it("should handle addTask.pending and addTask.fulfilled", () => {
        const pendingState = reducer(initialState, { type: addTask.pending.type });
        expect(pendingState.isSubmitting).toBe(true);

        const fulfilledState = reducer(pendingState, {
            type: addTask.fulfilled.type,
            payload: makeTask({ id: "new" }),
        });

        expect(fulfilledState.isSubmitting).toBe(false);
        expect(fulfilledState.items[0].id).toBe("new");
    });

    it("should handle toggleTaskStatus.fulfilled", () => {
        const stateWithItem: TasksState = {
            ...initialState,
            items: [makeTask({ id: "x", status: "stopped" })],
        };

        const nextState = reducer(stateWithItem, {
            type: toggleTaskStatus.fulfilled.type,
            payload: { taskId: "x", newStatus: "done" },
        });

        expect(nextState.items[0].status).toBe("done");
        expect(nextState.isSubmitting).toBe(false);
    });

    it("should handle deleteTask.fulfilled", () => {
        const stateWithItems: TasksState = {
            ...initialState,
            items: [makeTask({ id: "x" }), makeTask({ id: "y" })],
        };

        const nextState = reducer(stateWithItems, {
            type: deleteTask.fulfilled.type,
            payload: "x",
        });

        expect(nextState.items).toHaveLength(1);
        expect(nextState.items[0].id).toBe("y");
    });

    it("should handle rejected matcher", () => {
        const nextState = reducer(initialState, {
            type: "tasks/add/rejected",
            payload: "falha",
        });
        expect(nextState.isLoading).toBe(false);
        expect(nextState.isSubmitting).toBe(false);
        expect(nextState.error).toBe("falha");
    });

    it("selectFilteredTasks should filter by current filter", () => {
        const rootState: SliceRootState = {
            tasks: {
                ...initialState,
                filter: "done",
                items: [
                    makeTask({ id: "1", status: "done" }),
                    makeTask({ id: "2", status: "stopped" }),
                ],
            },
        };

        const result = selectFilteredTasks(rootState as never);
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("done");
    });

    it("selectTaskMetrics should count done tasks correctly", () => {
        const rootState: SliceRootState = {
            tasks: {
                ...initialState,
                items: [
                    makeTask({ id: "1", status: "done" }),
                    makeTask({ id: "2", status: "stopped" }),
                    makeTask({ id: "3", status: "done" }),
                ],
            },
        };

        const metrics = selectTaskMetrics(rootState as never);
        expect(metrics.total).toBe(3);
        expect(metrics.completed).toBe(2);
        expect(metrics.pending).toBe(1);
        expect(metrics.completionRate).toBe(67);
    });
});
