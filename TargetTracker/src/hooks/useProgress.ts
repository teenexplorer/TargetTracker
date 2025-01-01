import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DetailedProgress, PeriodProgress } from '../types/progress';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from '../utils/dates';
import { calculateProgress } from '../utils/progressCalculator';

export function useProgress() {
  const [periodProgress, setPeriodProgress] = useState<PeriodProgress>({
    daily: [],
    weekly: [],
    monthly: {} as DetailedProgress
  });
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    try {
      // Fetch daily progress for the last 7 days
      const dailyProgress = await Promise.all(
        Array.from({ length: 7 }).map(async (_, i) => {
          const start = startOfDay(new Date(), i);
          const end = endOfDay(new Date(), i);
          
          const { data: tasks } = await supabase
            .from('todos')
            .select('*, task_metrics(*)')
            .eq('user_id', user.id)
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());

          return calculateProgress(tasks || []);
        })
      );

      // Fetch weekly progress for the last 4 weeks
      const weeklyProgress = await Promise.all(
        Array.from({ length: 4 }).map(async (_, i) => {
          const start = startOfWeek(new Date(), i);
          const end = endOfWeek(new Date(), i);
          
          const { data: tasks } = await supabase
            .from('todos')
            .select('*, task_metrics(*)')
            .eq('user_id', user.id)
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());

          return calculateProgress(tasks || []);
        })
      );

      // Fetch monthly progress
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      
      const { data: monthlyTasks } = await supabase
        .from('todos')
        .select('*, task_metrics(*)')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      setPeriodProgress({
        daily: dailyProgress,
        weekly: weeklyProgress,
        monthly: calculateProgress(monthlyTasks || [])
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    periodProgress,
    loading,
    refreshProgress: fetchProgress
  };
}