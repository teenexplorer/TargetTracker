import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import ProgressChart from './ProgressChart';
import DailyChart from './charts/DailyChart';
import PeriodSelector from './PeriodSelector';
import { useProgress } from '../hooks/useProgress';
import { usePlanningPeriod } from '../hooks/usePlanningPeriod';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();
  const { periodProgress, loading: progressLoading, refreshProgress } = useProgress();
  const { planningPeriod } = usePlanningPeriod();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      return;
    }

    setTodos(data || []);
    refreshProgress(); // Refresh progress when todos change
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('todos')
      .insert([
        {
          text: newTodo.trim(),
          completed: false,
          user_id: user.id
        }
      ]);

    if (error) {
      console.error('Error adding todo:', error);
      return;
    }

    setNewTodo('');
    fetchTodos();
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      return;
    }

    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      return;
    }

    fetchTodos();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your ToDo List</h1>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
          
          <form onSubmit={addTodo} className="mb-6 flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 shadow-md"
            >
              <Plus size={20} />
              Add
            </button>
          </form>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {todos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-purple-100 hover:border-purple-200 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                  className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-pink-500 hover:text-pink-700 focus:outline-none transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="text-center text-gray-500 mt-6">No tasks yet. Add some!</p>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-8">
          <PeriodSelector />
          
          {!progressLoading && (
            <>
              <ProgressChart 
                progress={{
                  completed: todos.filter(t => t.completed).length,
                  total: todos.length,
                  onTime: todos.filter(t => t.completed).length, // This will be updated with actual metrics
                  extended: 0, // This will be updated with actual metrics
                  percentage: todos.length > 0 
                    ? (todos.filter(t => t.completed).length / todos.length) * 100 
                    : 0
                }} 
              />
              
              <DailyChart progress={periodProgress.daily} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}