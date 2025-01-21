import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, setMonth, setYear } from 'date-fns';
import { Employee, Task } from '../types/scheduler';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import axios from 'axios';

interface WeeklySchedulerProps {}

const WeeklyScheduler: React.FC<WeeklySchedulerProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get<Employee[]>('http://localhost:3001/api/schedule');
      console.log('API Response:', response.data); // Log the response
      setEmployees(response.data); // Assign response to state
    } catch (error) {

      console.error('Error fetching data:', error);
      setEmployees([]); // Fallback to empty array
    }
  };

  fetchData();
}, []);


  const getDaysOfWeek = (date: Date) => {
    // Start from Sunday (0) and get 5 days
    const start = startOfWeek(date);
    return Array.from({ length: 5 }, (_, i) => addDays(start, i));
  };

  const days = getDaysOfWeek(currentDate);

  const getTaskColor = (type: Task['type']) => {
    switch (type) {
      case 'work':
        return 'bg-blue-100 border-blue-200 hover:bg-blue-150';
      case 'meeting':
        return 'bg-purple-100 border-purple-200 hover:bg-purple-150';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(2024, i, 1), 'MMMM')
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => ({
    value: (currentYear - 1 + i).toString(),
    label: (currentYear - 1 + i).toString()
  }));

  const handleMonthChange = (value: string) => {
    const newDate = setMonth(currentDate, parseInt(value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (value: string) => {
    const newDate = setYear(currentDate, parseInt(value));
    setCurrentDate(newDate);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Weekly Schedule</h1>
        <div className="flex items-center gap-4">
          <Select onValueChange={handleMonthChange} value={currentDate.getMonth().toString()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearChange} value={currentDate.getFullYear().toString()}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            >
              Next Week
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="font-medium text-gray-700">Employee</div>
            {days.map((day) => (
              <div key={day.toString()} className="font-medium text-gray-700">
                {format(day, 'EEEE, MMM d')}
              </div>
            ))}
          </div>

  <div className="space-y-4">
  {Array.isArray(employees) && employees.length > 0 ? (
    employees.map((employee, index) => (
      <div key={employee.id}>
        <div className="grid grid-cols-6 gap-4 py-4">
          <div className="font-medium text-gray-700">{employee.name}</div>
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = employee.tasks[dateKey] || [];

            return (
              <div
                key={day.toString()}
                className="min-h-[120px] bg-gray-50 rounded-lg p-2 space-y-2 border border-gray-200"
              >
                {dayTasks.map((task) => (
                  <TooltipProvider key={task.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "p-2 rounded border text-sm transition-colors cursor-pointer",
                            getTaskColor(task.type)
                          )}
                        >
                          <div className="font-medium">{task.title}</div>
                          <div className="text-gray-600">
                            {task.startTime} - {task.endTime}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{task.description || `${task.title} (${task.type})`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            );
          })}
        </div>
        {index < employees.length - 1 && <Separator className="my-2" />}
      </div>
    ))
  ) : (
    <div className="text-gray-500 text-center">No employees or tasks available.</div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduler;