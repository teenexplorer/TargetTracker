import React from 'react';
import { TaskProgress } from '../types';

interface ProgressChartProps {
  progress: TaskProgress;
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Progress Overview</h3>
      
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                Task Completion
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {progress.percentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
            <div
              style={{ width: `${progress.percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            ></div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Completed Tasks</p>
            <p className="text-2xl font-bold text-purple-600">{progress.completed}/{progress.total}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Completed On Time</p>
            <p className="text-2xl font-bold text-green-600">{progress.onTime}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Extended Tasks</p>
            <p className="text-2xl font-bold text-orange-600">{progress.extended}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Remaining Tasks</p>
            <p className="text-2xl font-bold text-gray-600">{progress.total - progress.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}