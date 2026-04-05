interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function StatCard({
  label,
  value,
  icon,
  iconBg = 'bg-orange-50',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
        </div>
        <div className={`${iconBg} p-2.5 rounded-xl shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
