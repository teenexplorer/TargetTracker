/*
  # Enhanced Todo System Schema

  1. New Tables
    - `planning_periods`
      - Stores user preferences for planning period (daily/weekly)
    - `task_periods`
      - Groups tasks by their planning period (day/week)
    - `task_metrics`
      - Stores completion metrics and time tracking data
  
  2. Changes
    - Enhances the todo tracking system with time tracking and periodic planning
    - Adds support for daily/weekly planning cycles
    - Enables progress tracking and comparisons
*/

-- Planning periods table
CREATE TABLE planning_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  period_type text NOT NULL CHECK (period_type IN ('daily', 'weekly')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Task periods table
CREATE TABLE task_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  period_type text NOT NULL CHECK (period_type IN ('daily', 'weekly')),
  created_at timestamptz DEFAULT now()
);

-- Task metrics table
CREATE TABLE task_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id uuid REFERENCES todos NOT NULL,
  started_at timestamptz,
  completed_at timestamptz,
  original_due_date timestamptz,
  extended_count integer DEFAULT 0,
  time_spent interval DEFAULT '0'::interval,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE planning_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for planning_periods
CREATE POLICY "Users can manage their planning periods"
  ON planning_periods
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for task_periods
CREATE POLICY "Users can manage their task periods"
  ON task_periods
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for task_metrics
CREATE POLICY "Users can manage their task metrics"
  ON task_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = task_metrics.todo_id
      AND todos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = task_metrics.todo_id
      AND todos.user_id = auth.uid()
    )
  );

-- Add new columns to todos table
ALTER TABLE todos 
  ADD COLUMN IF NOT EXISTS task_period_id uuid REFERENCES task_periods,
  ADD COLUMN IF NOT EXISTS due_date timestamptz,
  ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high'));