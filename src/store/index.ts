import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/tasksSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            tasks: tasksReducer,
        },
        // Desabilitamos a checagem de serializabilidade para permitir instâncias do Firebase User se necessário, embora o ideal seja salvar dados puros
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

// Tipagens estritas para os Hooks Customizados
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof makeStore>['getState'];
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];