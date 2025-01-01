import { Todo, TaskMetrics } from '../types';

interface TodoWithMetrics extends Todo {
  task_metrics: TaskMetrics[];
}

export function calculateProgress(tasks: TodoWithMetrics[]) {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const onTime = tasks.filter(task => {
    const metrics = task.task_metrics?.[0];
    return task.completed && metrics?.extended_count === 0;
  }).length;
  
  const extended = tasks.filter(task => {
    const metrics = task.task_metrics?.[0];
    return metrics?.extended_count > 0;
  }).length;

  const timeSpent = tasks.reduce((total, task) => {
    const metrics = task.task_metrics?.[0];
    if (!metrics?.time_spent) return total;
    // Convert "X seconds" to number
    const seconds = parseInt(metrics.time_spent.split(' ')[0]);
    return total + (isNaN(seconds) ? 0 : seconds);
  }, 0);

  const expectedTime = total * 3600; // 1 hour per task as default expected time

  return {
    completed,
    total,
    onTime,
    extended,
    percentage: total > 0 ? (completed / total) * 100 : 0,
    tasksLeft: total - completed,
    tasksLeftPercentage: total > 0 ? ((total - completed) / total) * 100 : 0,
    performanceScore: calculatePerformanceScore(completed, total, onTime, extended, timeSpent, expectedTime),
    timeEfficiency: calculateTimeEfficiency(timeSpent, expectedTime)
  };
}

function calculatePerformanceScore(
  completed: number,
  total: number,
  onTime: number,
  extended: number,
  timeSpent: number,
  expectedTime: number
): number {
  if (total === 0) return 0;

  const completionScore = (completed / total) * 100;
  const timeScore = Math.min(100, (expectedTime / (timeSpent || expectedTime)) * 100);
  const extensionScore = Math.max(0, 100 - (extended / total) * 100);

  const weights = {
    completion: 0.4,
    time: 0.3,
    extension: 0.3
  };

  return (
    completionScore * weights.completion +
    timeScore * weights.time +
    extensionScore * weights.extension
  );
}

function calculateTimeEfficiency(timeSpent: number, expectedTime: number): number {
  if (expectedTime === 0) return 100;
  return Math.min(100, (expectedTime / (timeSpent || expectedTime)) * 100);
}