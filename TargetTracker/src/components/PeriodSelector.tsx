import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { usePlanningPeriod } from '../hooks/usePlanningPeriod';

export default function PeriodSelector() {
  const { planningPeriod, setPeriodType } = usePlanningPeriod();

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setPeriodType('daily')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          planningPeriod?.period_type === 'daily'
            ? 'bg-purple-500 text-white'
            : 'bg-white/50 hover:bg-white/80'
        }`}
      >
        <Clock size={20} />
        Daily Planning
      </button>
      <button
        onClick={() => setPeriodType('weekly')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          planningPeriod?.period_type === 'weekly'
            ? 'bg-purple-500 text-white'
            : 'bg-white/50 hover:bg-white/80'
        }`}
      >
        <Calendar size={20} />
        Weekly Planning
      </button>
    </div>
  );
}