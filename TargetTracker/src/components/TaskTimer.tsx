import React, { useState, useEffect } from 'react';
import { Timer, Pause, Play, Square } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TaskTimerProps {
  todoId: string;
}

export default function TaskTimer({ todoId }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setStartTime(new Date());
    setIsRunning(true);
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    if (startTime) {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      
      // Update task metrics
      const { error } = await supabase
        .from('task_metrics')
        .upsert({
          todo_id: todoId,
          time_spent: `${timeSpent} seconds`
        });

      if (error) {
        console.error('Error updating task metrics:', error);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <div className="flex items-center gap-2">
      <Timer size={16} className="text-gray-500" />
      <span className="font-mono">{formatTime(elapsedTime)}</span>
      {!isRunning ? (
        <button
          onClick={startTimer}
          className="p-1 hover:text-purple-600 transition-colors"
          title="Start Timer"
        >
          <Play size={16} />
        </button>
      ) : (
        <button
          onClick={pauseTimer}
          className="p-1 hover:text-purple-600 transition-colors"
          title="Pause Timer"
        >
          <Pause size={16} />
        </button>
      )}
      <button
        onClick={resetTimer}
        className="p-1 hover:text-red-600 transition-colors"
        title="Reset Timer"
      >
        <Square size={16} />
      </button>
    </div>
  );
}