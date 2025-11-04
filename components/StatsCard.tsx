interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  color?: "blue" | "green" | "purple" | "orange" | "red" | "gray";
  onClick?: () => void;
}

export function StatsCard({
  icon,
  label,
  value,
  change,
  trend,
  color = "blue",
  onClick,
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      text: "text-blue-600",
      lightBg: "bg-blue-100",
    },
    green: {
      bg: "bg-green-500",
      text: "text-green-600",
      lightBg: "bg-green-100",
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-600",
      lightBg: "bg-purple-100",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-600",
      lightBg: "bg-orange-100",
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-600",
      lightBg: "bg-red-100",
    },
    gray: {
      bg: "bg-gray-500",
      text: "text-gray-600",
      lightBg: "bg-gray-100",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-${color}-300 transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${colors.lightBg} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              trend === "up"
                ? "bg-green-100 text-green-700"
                : trend === "down"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>

      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: StatsCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}

export function MiniStatCard({
  icon,
  value,
  label,
  color = "blue",
}: {
  icon: string;
  value: string | number;
  label: string;
  color?: "blue" | "green" | "purple" | "orange";
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
      <div className={`text-2xl w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}

export function GradientStatsCard({
  icon,
  label,
  value,
  gradient = "from-blue-500 to-purple-500",
}: {
  icon: string;
  label: string;
  value: string | number;
  gradient?: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white`}>
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-3xl font-bold mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-white/80">{label}</div>
    </div>
  );
}

