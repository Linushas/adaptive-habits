// export interface Habit {
//   name: string;
//   value: number;
//   targetValue: number;
//   unit?: string;
// }

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