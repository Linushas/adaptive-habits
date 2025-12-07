
// ---- HABITS ----
export interface HabitResponse {
  name: string;
  description?: string
  current_target_value: number;
  frequency: string;
  unit?: string;
}

export interface HabitModel {
  name: string;
  description?: string
  current_target_value: number;
  frequency?: string;
  unit?: string;
}

// ---- ENTRIES ----

export interface HabitEntry {
  id: string,
  habit: HabitModel,
  log_date: string,
  value: number,
  target_snapshot: number,
  notes?: string,
}

export interface HabitEntryUpdate {
  id: string,
  habit?: HabitModel,
  log_date?: string,
  value?: number,
  target_snapshot?: number,
  notes?: string,
}

