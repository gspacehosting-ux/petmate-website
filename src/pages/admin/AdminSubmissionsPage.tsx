import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Inbox,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { FormSubmission, SubmissionStatus, FormType } from '../../types';

export const AdminSubmissionsPage: React.FC = () => {
  const { submissions, updateSubmissionStatus, deleteSubmission } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);

  const formTypes: FormType[] = ['Contact Form', 'Service Enquiry Form', 'Newsletter'];
  const statuses: SubmissionStatus[] = ['New', 'Contacted', 'Resolved'];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        s.customerName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.id.toLowerCase().includes(q);

      const matchType = filterType === 'All' || s.formType === filterType;
      const matchStatus = filterStatus === 'All' || s.status === filterStatus;

      return matchQuery && matchType && matchStatus;
    });
  }, [submissions, searchQuery, filterType, filterStatus]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Permanently remove submission from ${name}?`)) {
      deleteSubmission(id);
      if (viewingSubmission?.id === id) {
        setViewingSubmission(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532D]">
            Form Submissions &amp; Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Review service bookings, contact messages, and newsletter subscribers captured from the website.
          </p>
        </div>

        <div className="bg-[#EDF4E5] text-[#14532D] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
          <Inbox className="w-4 h-4 text-[#26752C]" />
          <span>{submissions.length} Total Records</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Form Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
          >
            <option value="All">All Form Types</option>
            {formTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-500">
            Showing <strong>{filteredSubmissions.length}</strong> items
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, ID..."
            className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-[#F0EAE1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#F0EAE1] text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone &amp; Email</th>
                <th className="p-4">Form Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No form submissions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-[#14532D]">
                      {sub.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#171717] text-sm">{sub.customerName}</div>
                      {sub.petType && (
                        <div className="text-[11px] text-gray-500">Pet: {sub.petType}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#171717]">{sub.phone}</div>
                      <div className="text-gray-400 text-[11px]">{sub.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-full ${
                          sub.formType === 'Service Enquiry Form'
                            ? 'bg-purple-100 text-purple-800'
                            : sub.formType === 'Contact Form'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.formType}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {sub.submissionDate}
                    </td>
                    <td className="p-4">
                      <select
                        value={sub.status}
                        onChange={(e) =>
                          updateSubmissionStatus(sub.id, e.target.value as SubmissionStatus)
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border border-transparent cursor-pointer ${
                          sub.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : sub.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSubmission(sub)}
                          className="p-1.5 text-gray-400 hover:text-[#14532D] rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id, sub.customerName)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setViewingSubmission(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden z-10 border border-[#F0EAE1] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F0]">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {viewingSubmission.formType}
                </span>
                <h3 className="text-base font-bold text-[#14532D]">
                  {viewingSubmission.customerName}
                </h3>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FFF9F0] p-4 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone</span>
                  <a
                    href={`tel:${viewingSubmission.phone}`}
                    className="font-bold text-[#14532D] hover:underline"
                  >
                    {viewingSubmission.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                  <a
                    href={`mailto:${viewingSubmission.email}`}
                    className="font-bold text-[#14532D] hover:underline truncate block"
                  >
                    {viewingSubmission.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Date Received</span>
                  <span className="font-semibold text-gray-700">{viewingSubmission.submissionDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-[#F4770B]">{viewingSubmission.status}</span>
                </div>
              </div>

              {viewingSubmission.petType && (
                <div>
                  <span className="font-bold text-gray-500 block mb-0.5">Pet Information:</span>
                  <p className="bg-gray-50 p-2.5 rounded-xl text-gray-700">
                    {viewingSubmission.petType}
                  </p>
                </div>
              )}

              {viewingSubmission.serviceRequired && (
                <div>
                  <span className="font-bold text-gray-500 block mb-0.5">Service Requested:</span>
                  <p className="bg-gray-50 p-2.5 rounded-xl text-gray-700">
                    {viewingSubmission.serviceRequired} {viewingSubmission.preferredDate ? `(Preferred Date: ${viewingSubmission.preferredDate})` : ''}
                  </p>
                </div>
              )}

              {viewingSubmission.subject && (
                <div>
                  <span className="font-bold text-gray-500 block mb-0.5">Subject:</span>
                  <p className="bg-gray-50 p-2.5 rounded-xl text-gray-700 font-semibold">
                    {viewingSubmission.subject}
                  </p>
                </div>
              )}

              <div>
                <span className="font-bold text-gray-500 block mb-0.5">Full Message:</span>
                <div className="bg-[#FFFDF9] border border-[#F0EAE1] p-3.5 rounded-xl text-gray-800 leading-relaxed whitespace-pre-line">
                  {viewingSubmission.message}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium">Mark as:</span>
                  <button
                    onClick={() => {
                      updateSubmissionStatus(viewingSubmission.id, 'New');
                      setViewingSubmission({ ...viewingSubmission, status: 'New' });
                    }}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md font-bold text-[10px]"
                  >
                    New
                  </button>
                  <button
                    onClick={() => {
                      updateSubmissionStatus(viewingSubmission.id, 'Contacted');
                      setViewingSubmission({ ...viewingSubmission, status: 'Contacted' });
                    }}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md font-bold text-[10px]"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => {
                      updateSubmissionStatus(viewingSubmission.id, 'Resolved');
                      setViewingSubmission({ ...viewingSubmission, status: 'Resolved' });
                    }}
                    className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md font-bold text-[10px]"
                  >
                    Resolved
                  </button>
                </div>

                <button
                  onClick={() => setViewingSubmission(null)}
                  className="bg-[#14532D] text-white px-4 py-1.5 rounded-xl font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
