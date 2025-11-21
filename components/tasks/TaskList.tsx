'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, Filter } from 'lucide-react';
import TaskItem from './TaskItem';
import TaskDialog from './TaskDialog';
import { Task, TaskCategory, Priority } from '@/lib/types';

export default function TaskList() {
  const { tasks, currentTaskId } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <>
      <Card className="p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold">Tasks</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({activeTasks.length})
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={showCompleted ? 'default' : 'outline'}
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs"
          >
            <Filter className="w-3 h-3 mr-1" />
            Completed
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {activeTasks.length === 0 && !showCompleted && (
            <div className="text-center py-12">
              <ListTodo className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No tasks yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add a task to get started!
              </p>
            </div>
          )}

          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={task.id === currentTaskId}
            />
          ))}

          {showCompleted && completedTasks.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Completed ({completedTasks.length})
                </h3>
              </div>
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} isActive={false} />
              ))}
            </>
          )}
        </div>
      </Card>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}