"use client";

import { LogOut, ShieldAlert, Users, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogs() {
  const router = useRouter();

  const logs = [
    { id: 'LOG-991', time: '10:42 AM', user: 'Khizr (Admin)', action: 'System Login', ip: '192.168.1.42', status: 'Success' },
    { id: 'LOG-990', time: '10:40 AM', user: 'Sarah (Employee)', action: 'Requested Escalation for REQ-842', ip: '10.0.0.15', status: 'Success' },
    { id: 'LOG-989', time: '10:35 AM', user: 'Nadeem (Dept Head)', action: 'Created New Credentials for Employee', ip: '10.0.0.21', status: 'Success' },
    { id: 'LOG-988', time: '10:31 AM', user: 'Unknown', action: 'Failed 2FA Attempt', ip: '45.22.19.11', status: 'Blocked' },
    { id: 'LOG-987', time: '09:15 AM', user: 'Shritan (Employee)', action: 'System Logout', ip: '192.168.1.18', status: 'Success' },
    { id: 'LOG-986', time: '09:00 AM', user: 'Khizr (Admin)', action: 'Rotated API Keys', ip: '192.168.1.42', status: 'Success' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-zinc-900" />
            <h1 className="font-semibold text-sm tracking-tight">Project Turing | Admin Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-100 rounded">Role: Admin</span>
            <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full"><Users className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500">Active Sessions</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-full"><ShieldAlert className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500">Failed 2FA Attempts (24h)</p>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-full"><Activity className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500">System Health</p>
              <p className="text-2xl font-semibold">100%</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">System Audit Logs</h2>
          <p className="text-sm text-zinc-500 mt-1">Immutable ledger of all credential changes, logins, and overrides.</p>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Log ID</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Timestamp</th>
                <th className="px-4 sm:px-6 py-3 font-medium">User & Role</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Action Event</th>
                <th className="px-4 sm:px-6 py-3 font-medium">IP Address</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">{log.id}</td>
                  <td className="px-4 sm:px-6 py-4 text-zinc-500">{log.time}</td>
                  <td className="px-4 sm:px-6 py-4 font-medium text-zinc-900">{log.user}</td>
                  <td className="px-4 sm:px-6 py-4 text-zinc-700">{log.action}</td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">{log.ip}</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' : 'bg-red-50 text-red-700 ring-red-600/10'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
