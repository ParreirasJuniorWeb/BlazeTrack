// Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// authServices
// Auth Services module
import { authService } from "./services/authService";
// types
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from "./types";
// import Cookies
import Cookies from "js-cookie";
// import helpers
// Convert Firebase error codes/objects into friendly messages
import { handleErrorMessages } from "../../utils/handleFirebaseAuthErrorMessages";

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// --- Thunks Assíncronas (Ligam as ações da UI ao Serviço do Firebase) ---

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      return await authService.register(credentials);
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao criar conta.");
    }
  },
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.loginWithEmail(credentials);
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao realizar login.");
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.loginWithGoogle();
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro no login com Google.");
    }
  },
);

export const loginWithGithub = createAsyncThunk(
  "auth/loginWithGithub",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.loginWithGithub();
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro no login com GitHub.");
    }
  },
);

// --- O Slice de Autenticação ---

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // 🚀 Action para reidratar o estado quando o Firebase validar o usuário
    setAuthenticatedUser: (
      state,
      action: PayloadAction<UserProfile | null>,
    ) => {
      state.user = action.payload;
      state.isLoading = false; // Desativa o loading de inicialização
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos de Sucesso (Fulfilled) - Salvam o perfil do usuário no estado global
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = null;

          // 🔐 Correção da extração do UID com fallback de segurança
          const uid = action.payload?.uid;

          if (uid) {
            Cookies.set("blazetrack_session", uid, {
              expires: 7,
              secure: true,
            });
          } else {
            console.error(
              "❌ BlazeTrack Debug: UID não encontrado no payload",
              action.payload,
            );
          }

          // 🚀 SALVA O COOKIE DE SESSÃO (Expira em 7 dias ou conforme sua regra)
          Cookies.set("blazetrack_session", uid, { expires: 7, secure: true });
        },
      )
      .addCase(
        loginWithEmail.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = null;

          // 🔐 Correção da extração do UID com fallback de segurança
          const uid = action.payload?.uid;

          if (uid) {
            Cookies.set("blazetrack_session", uid, {
              expires: 7,
              secure: true,
            });
          } else {
            console.error(
              "❌ BlazeTrack Debug: UID não encontrado no payload",
              action.payload,
            );
          }

          // 🚀 SALVA O COOKIE DE SESSÃO (Expira em 7 dias ou conforme sua regra)
          Cookies.set("blazetrack_session", uid, { expires: 7, secure: true });
        },
      )
      .addCase(
        loginWithGoogle.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = null;

          // 🔐 Correção da extração do UID com fallback de segurança
          const uid = action.payload?.uid;

          if (uid) {
            Cookies.set("blazetrack_session", uid, {
              expires: 7,
              secure: true,
            });
          } else {
            console.error(
              "❌ BlazeTrack Debug: UID não encontrado no payload",
              action.payload,
            );
          }

          // 🚀 SALVA O COOKIE DE SESSÃO (Expira em 7 dias ou conforme sua regra)
          Cookies.set("blazetrack_session", uid, { expires: 7, secure: true });
        },
      )
      .addCase(
        loginWithGithub.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = null;

          // 🔐 Correção da extração do UID com fallback de segurança
          const uid = action.payload?.uid;

          if (uid) {
            Cookies.set("blazetrack_session", uid, {
              expires: 7,
              secure: true,
            });
          } else {
            console.error(
              "❌ BlazeTrack Debug: UID não encontrado no payload",
              action.payload,
            );
          }

          // 🚀 SALVA O COOKIE DE SESSÃO (Expira em 7 dias ou conforme sua regra)
          Cookies.set("blazetrack_session", uid, { expires: 7, secure: true });
        },
      )
      // Casos Comuns de Carregamento (Loading)
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      // Casos Comuns de Falha (Rejected)
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = handleErrorMessages(action.payload);
        },
      );
  },
});

export const { logout, clearError, setAuthenticatedUser, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;