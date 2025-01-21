export type TaskType = 'work' | 'meeting';

export interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: TaskType;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  tasks: {
    [key: string]: Task[]; // key is the date string
  };
}