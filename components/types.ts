export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type DayLog = {
  /** YYYY-MM-DD */
  date: string;
  minutes: number; // total minutes learned this day
  tasks: Task[];
};
