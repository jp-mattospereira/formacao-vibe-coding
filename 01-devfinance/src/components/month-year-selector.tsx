"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthYearSelectorProps {
  currentDate: Date;
}

export function MonthYearSelector({ currentDate }: MonthYearSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigateTo(date: Date) {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month.toString());
    params.set("year", year.toString());
    
    router.push(`?${params.toString()}`);
  }

  function prevMonth() {
    navigateTo(subMonths(currentDate, 1));
  }

  function nextMonth() {
    navigateTo(addMonths(currentDate, 1));
  }

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
      <button
        onClick={prevMonth}
        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <span className="text-white font-medium capitalize min-w-[120px] text-center">
        {format(currentDate, "MMMM yyyy", { locale: ptBR })}
      </span>

      <button
        onClick={nextMonth}
        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
