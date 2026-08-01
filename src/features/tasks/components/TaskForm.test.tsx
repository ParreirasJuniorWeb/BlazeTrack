import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./TaskForm";
import { addTask } from "../tasksSlice";

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock("../../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    mockSelector(selector),
}));

const toastCustomMock = jest.fn();
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    custom: (...args: unknown[]) => toastCustomMock(...args),
  },
}));

jest.mock("@/src/components/ui/Alert/Alert", () => ({
  __esModule: true,
  default: () => <div data-testid="alert">Alert</div>,
}));

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    mockSelector.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ tasks: { isSubmitting: false, error: null } }),
    );

    render(<TaskForm isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText("Criar Nova Tarefa")).not.toBeInTheDocument();
  });

  it("should show validation errors on invalid submit", async () => {
    const user = userEvent.setup();

    mockSelector.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ tasks: { isSubmitting: false, error: null } }),
    );

    render(<TaskForm isOpen={true} onClose={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Adicionar Tarefa" }));

    expect(
      await screen.findByText("O título é obrigatório"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("A descrição é obrigatória"),
    ).toBeInTheDocument();
  });

  it("should render store error message", () => {
    mockSelector.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ tasks: { isSubmitting: false, error: "Falha no Firestore" } }),
    );

    render(<TaskForm isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText(/Erro de Gravação/i)).toBeInTheDocument();
    expect(screen.getByText(/Falha no Firestore/i)).toBeInTheDocument();
  });

  it("should submit with valid data, close modal and trigger toast on success", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    mockSelector.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ tasks: { isSubmitting: false, error: null } }),
    );

    mockDispatch.mockResolvedValue({
      type: addTask.fulfilled.type,
      payload: { id: "new-task" },
    });

    render(<TaskForm isOpen={true} onClose={onClose} />);

    await user.type(
      screen.getByPlaceholderText("Ex: Refatorar contexto de autenticação"),
      "Nova tarefa",
    );
    await user.type(
      screen.getByPlaceholderText(
        "Descreva detalhadamente o que deve ser feito nesta tarefa...",
      ),
      "Descrição da nova tarefa",
    );

    await user.click(screen.getByRole("button", { name: "Adicionar Tarefa" }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(toastCustomMock).toHaveBeenCalledTimes(1);
  });
});
