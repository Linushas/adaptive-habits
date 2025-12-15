// ---- HABITS ----
export interface HabitResponse {
  name: string;
  description?: string;
  current_target_value: number;
  frequency: string;
  unit?: string;
}

export interface HabitModel {
  name: string;
  description?: string;
  current_target_value: number;
  frequency?: string;
  unit?: string;
}

export interface Habit extends HabitModel {
  id: string;
  user_id: string;
  created_at: string;
}

// ---- ENTRIES ----

export interface HabitEntry {
  id: string;
  habit: Habit;
  log_date: string;
  value: number;
  target_snapshot: number;
  notes?: string;
}

export interface HabitEntryUpdate {
  id: string;
  habit?: Habit;
  log_date?: string;
  value?: number;
  target_snapshot?: number;
  notes?: string;
}

export interface CalendarHabitEntry {
  log_date: string;
  completion_percentage: number;
}

export interface HabitEntryClean {
  id: string;
  log_date: string;
  value: number;
  target_snapshot: number;
  notes?: string;
}

export interface HabitDetails {
  habit: Habit;
  snapshots: HabitEntryClean[];
}
