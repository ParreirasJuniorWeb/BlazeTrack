import { useEffect, useState } from "react";

export default function Loading({ isLoading }: { isLoading: boolean }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setPercent(0);
      return;
    }

    const interval = setInterval(() => {
      setPercent((prevPercent) => {
        const newPercent = Math.floor(Math.min(prevPercent + Math.random() * 30, 90));
        return newPercent;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gray-300">
      <div className="absolute inset-0 rounded-full bg-blue-100"></div>

      <div className="absolute inset-0 rounded-full bg-gray-500/20 border-15 border-orange-500 border-t-transparent"></div>

      <div className="absolute flex items-center justify-center w-24.5 h-24.5 bg-white rounded-full">
        <span className="font-bold text-orange-500">{percent || "0"}%</span>
      </div>
    </div>
  );
}
