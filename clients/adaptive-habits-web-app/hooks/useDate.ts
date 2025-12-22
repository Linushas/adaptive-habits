import { formatDateForApi } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useDate(paramStr: string, initialDate: Date) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get(paramStr);

  const date = useMemo(() => {
    return dateParam ? new Date(dateParam) : initialDate;
  }, [dateParam, initialDate]);

  const setDate = useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;
      const params = new URLSearchParams(searchParams.toString());

      const adjustedDate = new Date(newDate);
      adjustedDate.setHours(12, 0, 0, 0);

      params.set(paramStr, formatDateForApi(adjustedDate));
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, paramStr]
  );

  const addMonths = useCallback(
    (amount: number) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + amount);
      setDate(newDate);
    },
    [date, setDate]
  );

  const resetToToday = useCallback(() => {
    setDate(initialDate);
  }, [setDate, initialDate]);

  return {
    date,
    setDate,
    addMonths,
    resetToToday,
  };
}
