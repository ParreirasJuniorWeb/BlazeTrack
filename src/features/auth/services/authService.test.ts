import { authService } from "./authService";

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignInWithPopup = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: (...args: unknown[]) =>
        mockCreateUserWithEmailAndPassword(...args),
    signInWithEmailAndPassword: (...args: unknown[]) =>
        mockSignInWithEmailAndPassword(...args),
    signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
    GoogleAuthProvider: class GoogleAuthProvider { },
    GithubAuthProvider: class GithubAuthProvider { },
}));

const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => "server-ts");

jest.mock("firebase/firestore", () => ({
    doc: (...args: unknown[]) => mockDoc(...args),
    setDoc: (...args: unknown[]) => mockSetDoc(...args),
    getDoc: (...args: unknown[]) => mockGetDoc(...args),
    serverTimestamp: () => mockServerTimestamp(),
}));

jest.mock("../../../config/firebase", () => ({
    auth: { app: "auth-app" },
    db: { app: "db-app" },
}));

describe("authService", () => {
    const fakeUser = {
        uid: "uid-1",
        email: "dev@test.com",
        displayName: "Dev User",
        photoURL: "https://img",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockDoc.mockImplementation((_db: unknown, col: string, id: string) => ({
            col,
            id,
            path: `${col}/${id}`,
        }));
        mockSetDoc.mockResolvedValue(undefined);
    });

    it("register should create user, update profile and sync firestore", async () => {
        mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: fakeUser });
        mockUpdateProfile.mockResolvedValue(undefined);
        mockGetDoc.mockResolvedValue({
            exists: () => false,
            data: () => ({}),
        });

        const result = await authService.register({
            name: "Dev User",
            email: "dev@test.com",
            password: "123456",
            confirmPassword: "123456",
        });

        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
        expect(mockUpdateProfile).toHaveBeenCalledWith(fakeUser, {
            displayName: "Dev User",
        });
        expect(mockGetDoc).toHaveBeenCalled();
        expect(mockSetDoc).toHaveBeenCalled();
        expect(result.uid).toBe("uid-1");
        expect(result.displayName).toBe("Dev User");
    });

    it("loginWithEmail should sign in and sync firestore", async () => {
        mockSignInWithEmailAndPassword.mockResolvedValue({ user: fakeUser });
        mockGetDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ createdAt: "old-created-at" }),
        });

        const result = await authService.loginWithEmail({
            email: "dev@test.com",
            password: "123456",
        });

        expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
        expect(mockGetDoc).toHaveBeenCalled();
        expect(mockSetDoc).toHaveBeenCalled();
        expect(result.uid).toBe("uid-1");
    });

    it("loginWithGoogle should use popup and sync firestore", async () => {
        mockSignInWithPopup.mockResolvedValue({ user: fakeUser });
        mockGetDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ createdAt: "old-created-at" }),
        });

        const result = await authService.loginWithGoogle();

        expect(mockSignInWithPopup).toHaveBeenCalled();
        expect(mockSetDoc).toHaveBeenCalled();
        expect(result.uid).toBe("uid-1");
    });

    it("loginWithGithub should use popup and sync firestore", async () => {
        mockSignInWithPopup.mockResolvedValue({ user: fakeUser });
        mockGetDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ createdAt: "old-created-at" }),
        });

        const result = await authService.loginWithGithub();

        expect(mockSignInWithPopup).toHaveBeenCalled();
        expect(mockSetDoc).toHaveBeenCalled();
        expect(result.uid).toBe("uid-1");
    });
});
