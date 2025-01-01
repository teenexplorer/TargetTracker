export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  task_period_id?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface TaskMetrics {
  id: string;
  todo_id: string;
  started_at?: string;
  completed_at?: string;
  original_due_date?: string;
  extended_count: number;
  time_spent?: string;
  created_at: string;
}

export interface TaskPeriod {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  period_type: 'daily' | 'weekly';
  created_at: string;
}

export interface PlanningPeriod {
  id: string;
  user_id: string;
  period_type: 'daily' | 'weekly';
  created_at: string;
}

export interface TaskProgress {
  completed: number;
  total: number;
  onTime: number;
  extended: number;
  percentage: number;
}