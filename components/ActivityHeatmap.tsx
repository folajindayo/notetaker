'use client';

import { useState, useMemo } from 'react';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  activities: ActivityData[];
  year?: number;
}

export default function ActivityHeatmap({
  activities,
  year = new Date().getFullYear(),
}: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState(year);

  // Generate all dates for the year
  const yearData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const dates: { date: string; count: number; day: number }[] = [];

    const activityMap = new Map(
      activities.map((a) => [a.date, a.count])
    );

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
        day: d.getDay(),
      });
    }

    return dates;
  }, [activities, selectedYear]);

  // Group by weeks
  const weeks = useMemo(() => {
    const weeksArray: typeof yearData[] = [];
    let currentWeek: typeof yearData = [];

    // Add padding for the first week
    const firstDay = yearData[0]?.day || 0;
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', count: 0, day: i });
    }

    yearData.forEach((day) => {
      currentWeek.push(day);
      if (day.day === 6 || day === yearData[yearData.length - 1]) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeksArray;
  }, [yearData]);

  // Get color based on activity count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 3) return 'bg-green-200 dark:bg-green-900';
    if (count <= 6) return 'bg-green-400 dark:bg-green-700';
    if (count <= 9) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-400';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalActivity = activities.reduce((sum, a) => sum + a.count, 0);
    const activeDays = activities.filter((a) => a.count > 0).length;
    const maxStreak = calculateMaxStreak(activities);
    const currentStreak = calculateCurrentStreak(activities);
    const avgPerDay = totalActivity / Math.max(activeDays, 1);

    return {
      totalActivity,
      activeDays,
      maxStreak,
      currentStreak,
      avgPerDay: avgPerDay.toFixed(1),
    };
  }, [activities]);

  // Calculate max streak
  function calculateMaxStreak(activities: ActivityData[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedActivities.length; i++) {
      if (sortedActivities[i].count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  // Calculate current streak
  function calculateCurrentStreak(activities: ActivityData[]): number {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const activity of sortedActivities) {
      if (activity.date <= today && activity.count > 0) {
        streak++;
      } else if (activity.date < today) {
        break;
      }
    }

    return streak;
  }

  // Month labels
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Day labels
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Available years
  const availableYears = [
    selectedYear - 2,
    selectedYear - 1,
    selectedYear,
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔥 Activity Heatmap
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your contribution activity over the year
          </p>
        </div>

        {/* Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {stats.totalActivity}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Total Actions
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {stats.activeDays}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Active Days
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-xl">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {stats.maxStreak}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            Max Streak
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {stats.avgPerDay}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Avg Per Day
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 ml-8">
            {months.map((month, i) => (
              <div
                key={month}
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{
                  width: `${100 / 12}%`,
                  textAlign: 'center',
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-around mr-2">
              {['Mon', 'Wed', 'Fri'].map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-600 dark:text-gray-400 h-3"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const day = week.find((d) => d.day === dayIndex);
                    if (!day || !day.date) {
                      return (
                        <div
                          key={dayIndex}
                          className="w-3 h-3 rounded-sm"
                        />
                      );
                    }

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 ${getColor(
                          day.count
                        )}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            date: day.date,
                            count: day.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Less
        </div>
        <div className="flex gap-1">
          {[0, 3, 6, 9, 12].map((count) => (
            <div
              key={count}
              className={`w-3 h-3 rounded-sm ${getColor(count)}`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          More
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-xl pointer-events-none"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 60,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold">
            {new Date(hoveredCell.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="text-gray-300 mt-1">
            {hoveredCell.count} {hoveredCell.count === 1 ? 'action' : 'actions'}
          </div>
        </div>
      )}
    </div>
  );
}

