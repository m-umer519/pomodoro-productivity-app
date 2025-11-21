'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import {
  CheckCircle2,
  Circle,
  Play,
  MoreVertical,
  Trash2,
  Edit,
  Target,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TaskDialog from './TaskDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskItemProps {
  task: Task;
  isActive: boolean;
}

export default function TaskItem({ task, isActive }: TaskItemProps) {
  const { toggleTaskComplete, setCurrentTask, deleteTask } = useAppStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const categoryStyle = CATEGORY_COLORS[task.category];
  const priorityStyle = PRIORITY_COLORS[task.priority];

  return (
    <>
      <div
        className={cn(
          'group p-4 rounded-lg border-2 transition-all hover:shadow-md',
          isActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          task.completed && 'opacity-60'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className="mt-1 flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-semibold text-sm mb-1',
                task.completed && 'line-through text-gray-500'
              )}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  categoryStyle.bg,
                  categoryStyle.text
                )}
              >
                {task.category}
              </span>

              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  priorityStyle.bg,
                  priorityStyle.text
                )}
              >
                {task.priority}
              </span>

              {task.deadline && (
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.deadline), 'MMM dd')}
                </span>
              )}

              <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Target className="w-3 h-3" />
                {task.pomodorosCompleted}/{task.pomodorosEstimated}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.completed && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setCurrentTask(isActive ? null : task.id)}
              >
                <Play
                  className={cn(
                    'w-4 h-4',
                    isActive ? 'text-purple-600 fill-purple-600' : ''
                  )}
                />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <TaskDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
      />
    </>
  );
}