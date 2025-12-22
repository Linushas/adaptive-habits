import { formatDateForApi } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useDate(paramStr: string, initialDate: Date) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get(paramStr);
  const selectedDate = useMemo(() => {
    return dateParam ? new Date(dateParam) : initialDate;
  }, [dateParam]);

  const onSelectedDate = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const params = new URLSearchParams(searchParams.toString());

      const adjustedDate = new Date(date);
      adjustedDate.setHours(12, 0, 0, 0);
      params.set(paramStr, formatDateForApi(adjustedDate));

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return [selectedDate, onSelectedDate] as const;
}
