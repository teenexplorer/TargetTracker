export interface DetailedProgress extends TaskProgress {
  tasksLeft: number;
  tasksLeftPercentage: number;
  performanceScore: number; // 0-100 based on completion time and extensions
  timeEfficiency: number; // percentage of tasks completed within original time
}

export interface PeriodProgress {
  daily: DetailedProgress[];
  weekly: DetailedProgress[];
  monthly: DetailedProgress;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}