import React from 'react';
import { RequestStatus } from '../../types';
import { Clock, RefreshCw, AlertTriangle, FileCheck, CheckCircle2, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'menunggu_verifikasi':
        return {
          label: 'Menunggu Verifikasi',
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: Clock
        };
      case 'diproses':
        return {
          label: 'Diproses Operator',
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
          dot: 'bg-blue-500',
          icon: RefreshCw
        };
      case 'menunggu_ttd_kades':
        return {
          label: 'Menunggu TTD Kades',
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
          dot: 'bg-purple-500',
          icon: FileCheck
        };
      case 'butuh_perbaikan':
        return {
          label: 'Butuh Perbaikan',
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500',
          icon: AlertTriangle
        };
      case 'selesai_siap_ambil':
        return {
          label: 'Selesai & Siap Diambil',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'sudah_diambil':
        return {
          label: 'Sudah Diserahkan (Arsip)',
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: Archive
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          icon: Clock
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs whitespace-nowrap transition-all ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
