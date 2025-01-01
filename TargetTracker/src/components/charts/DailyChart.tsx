import React from 'react';
import { DetailedProgress } from '../../types/progress';
import { formatDate } from '../../utils/dates';

interface DailyChartProps {
  progress: DetailedProgress[];
}

export default function DailyChart({ progress }: DailyChartProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Daily Performance</h3>
      
      <div className="space-y-4">
        {progress.map((day, index) => (
          <div key={index} className="border-b border-purple-100 pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{formatDate(new Date(), index)}</span>
              <span className="text-purple-600">{day.performanceScore.toFixed(1)}% Performance</span>
            </div>
            
            {/* Progress bars */}
            <div className="space-y-2">
              {/* Completion Progress */}
              <div className="relative h-2 bg-purple-100 rounded">
                <div
                  className="absolute h-full bg-purple-500 rounded"
                  style={{ width: `${day.percentage}%` }}
                />
              </div>
              
              {/* Time Efficiency */}
              <div className="relative h-2 bg-blue-100 rounded">
                <div
                  className="absolute h-full bg-blue-500 rounded"
                  style={{ width: `${day.timeEfficiency}%` }}
                />
              </div>
              
              {/* Task Extension Rate */}
              <div className="relative h-2 bg-orange-100 rounded">
                <div
                  className="absolute h-full bg-orange-500 rounded"
                  style={{ width: `${(day.extended / day.total) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
              <div>
                <span className="text-gray-600">Completed: </span>
                <span className="font-medium">{day.completed}/{day.total}</span>
              </div>
              <div>
                <span className="text-gray-600">On Time: </span>
                <span className="font-medium">{day.onTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Extended: </span>
                <span className="font-medium">{day.extended}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}