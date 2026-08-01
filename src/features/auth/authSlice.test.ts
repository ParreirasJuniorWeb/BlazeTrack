import reducer, {
    clearError,
    loginWithEmail,
    loginWithGithub,
    loginWithGoogle,
    logout,
    registerUser,
} from "./authSlice";
import type { AuthState, UserProfile } from "./types";

jest.mock("js-cookie", () => ({
    __esModule: true,
    default: {
        set: jest.fn(),
    },
}));

jest.mock("./services/authService", () => ({
    authService: {
        register: jest.fn(),
        loginWithEmail: jest.fn(),
        loginWithGoogle: jest.fn(),
        loginWithGithub: jest.fn(),
    },
}));

jest.mock("../../utils/handleFirebaseAuthErrorMessages", () => ({
    handleErrorMessages: jest.fn((msg: unknown) => `handled:${String(msg)}`),
}));

const makeUser = (): UserProfile =>
({
    uid: "user-1",
    email: "user@test.com",
    displayName: "User Test",
    photoURL: "",
    createdAt: {} as UserProfile["createdAt"],
    lastLogin: {},
} as UserProfile);

describe("authSlice", () => {
    const initialState: AuthState = {
        user: null,
        isLoading: false,
        error: null,
    };

    it("should return initial state", () => {
        const state = reducer(undefined, { type: "unknown" });
        expect(state).toEqual(initialState);
    });

    it("should handle logout", () => {
        const stateWithUser: AuthState = {
            ...initialState,
            user: makeUser(),
            error: "some-error",
        };

        const result = reducer(stateWithUser, logout());
        expect(result.user).toBeNull();
        expect(result.error).toBeNull();
    });

    it("should handle clearError", () => {
        const stateWithError: AuthState = {
            ...initialState,
            error: "error-text",
        };

        const result = reducer(stateWithError, clearError());
        expect(result.error).toBeNull();
    });

    it("should set loading true on pending actions", () => {
        const pendingAction = registerUser.pending("req-1", {
            name: "Dev",
            email: "dev@test.com",
            password: "123456",
            confirmPassword: "123456",
        });

        const result = reducer(initialState, pendingAction);
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
    });

    it("should handle rejected action using error handler", () => {
        const rejectedAction = loginWithEmail.rejected(
            null,
            "req-2",
            { email: "dev@test.com", password: "123456" },
            "auth/invalid-credential"
        );

        const result = reducer(initialState, rejectedAction);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBe("handled:auth/invalid-credential");
    });

    it("should handle fulfilled register and save user", () => {
        const user = makeUser();
        const fulfilledAction = registerUser.fulfilled(user, "req-3", {
            name: "Dev",
            email: "dev@test.com",
            password: "123456",
            confirmPassword: "123456",
        });

        const result = reducer(initialState, fulfilledAction);
        expect(result.isLoading).toBe(false);
        expect(result.user).toEqual(user);
        expect(result.error).toBeNull();
    });

    it("should handle fulfilled loginWithGoogle", () => {
        const user = makeUser();
        const fulfilledAction = loginWithGoogle.fulfilled(user, "req-4");

        const result = reducer(initialState, fulfilledAction);
        expect(result.isLoading).toBe(false);
        expect(result.user).toEqual(user);
        expect(result.error).toBeNull();
    });

    it("should handle fulfilled loginWithGithub", () => {
        const user = makeUser();
        const fulfilledAction = loginWithGithub.fulfilled(user, "req-5");

        const result = reducer(initialState, fulfilledAction);
        expect(result.isLoading).toBe(false);
        expect(result.user).toEqual(user);
        expect(result.error).toBeNull();
    });
});
