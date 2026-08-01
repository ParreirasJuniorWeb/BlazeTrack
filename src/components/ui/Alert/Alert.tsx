import toast from "react-hot-toast";

type IToast = {
  msg: string;
  type: string;
  toastId: string;
};

export default function Alert({ msg, type, toastId }: IToast) {
  return type === "error" ? (
    <>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-center justify-between text-red-600 max-w-80 w-full bg-red-600/10 h-10 shadow">
          <div className="h-full w-1.5 bg-red-600"></div>
          <div className="flex items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon line"
            >
              <path
                style={{
                  fill: "none",
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.95,
                }}
                d="M11.95 16.5h.1"
              />
              <path
                d="M3 12a9 9 0 0 1 9-9h0a9 9 0 0 1 9 9h0a9 9 0 0 1-9 9h0a9 9 0 0 1-9-9m9 0V7"
                style={{
                  fill: "none",
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.5,
                }}
              />
            </svg>
            <p className="text-sm ml-2">{msg}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          type="button"
          aria-label="close"
          className="active:scale-90 transition-all mr-3"
          onClick={() => toast.dismiss(toastId)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  ) : (
    <div className="bg-white inline-flex space-x-3 p-3 text-sm rounded border border-gray-200">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <h3 className="text-slate-700 font-medium">Successfully saved!</h3>
        <p className="text-slate-500">
          {msg || "Anyone with a link can now view this file."}
        </p>
      </div>
      <button
        type="button"
        aria-label="close"
        onClick={() => toast.dismiss(toastId)}
        className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="12.532"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-45.74 0 12.532)"
            fill="currentColor"
            fillOpacity=".7"
          />
          <rect
            x="12.531"
            y="13.914"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-135.74 12.531 13.914)"
            fill="currentColor"
            fillOpacity=".7"
          />
        </svg>
      </button>
    </div>
  );
}
