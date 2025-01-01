import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PlanningPeriod } from '../types';

export function usePlanningPeriod() {
  const [planningPeriod, setPlanningPeriod] = useState<PlanningPeriod | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanningPeriod = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('planning_periods')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching planning period:', error);
        return;
      }

      setPlanningPeriod(data || { period_type: 'daily' });
    } catch (error) {
      console.error('Error in fetchPlanningPeriod:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPeriodType = async (periodType: 'daily' | 'weekly') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // First, check if a planning period exists
      const { data: existingPeriod } = await supabase
        .from('planning_periods')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      
      if (existingPeriod) {
        // Update existing period
        result = await supabase
          .from('planning_periods')
          .update({ period_type: periodType })
          .eq('id', existingPeriod.id)
          .select()
          .single();
      } else {
        // Insert new period
        result = await supabase
          .from('planning_periods')
          .insert({ user_id: user.id, period_type: periodType })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error setting planning period:', result.error);
        return;
      }

      setPlanningPeriod(result.data);
    } catch (error) {
      console.error('Error in setPeriodType:', error);
    }
  };

  useEffect(() => {
    fetchPlanningPeriod();
  }, []);

  return {
    planningPeriod,
    loading,
    setPeriodType
  };
}