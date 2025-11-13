import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import timeLogService from '../../services/timeLog.service';
import ManualTimeForm from './components/ManualTimeForm';
import Alert from '../../components/common/Alert';
import DashboardLayout from '../../layout/DashboardLayout';
 
const ManualTimeEntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
 
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
 
      await timeLogService.addManualTime(formData.taskId, {
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description
      });
 
      setSuccess(true);
      setTimeout(() => {
        navigate('/time-tracking');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add time entry');
    } finally {
      setLoading(false);
    }
  };
 
  return (
<DashboardLayout>
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
<div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
<div className="mb-8">
<button
              onClick={() => navigate('/time-tracking')}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all group px-4 py-2 rounded-lg hover:bg-white/50 text-sm"
>
<svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
</svg>
<span className="font-medium">Back to Time Tracking</span>
</button>
 
            <div className="flex items-center gap-4 mb-4">
<div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
</svg>
</div>
<div>
<h1 className="text-3xl font-bold text-gray-900">Add Manual Time Entry</h1>
<p className="text-gray-600 text-base mt-1">Record time spent on a task manually</p>
</div>
</div>
</div>
 
          {/* Alerts */}
          {error && (
<div className="mb-6 animate-in slide-in-from-top duration-300">
<Alert type="error" message={error} onClose={() => setError(null)} />
</div>
          )}
 
          {success && (
<div className="mb-6 animate-in slide-in-from-top duration-300">
<Alert type="success" message="Time entry added successfully!" autoClose={false} />
</div>
          )}
 
          {/* Form Card */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Card Header */}
<div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
<div className="flex items-center gap-3 text-white">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
</svg>
<div>
<h2 className="text-lg font-semibold">Time Entry Details</h2>
<p className="text-blue-100 text-sm mt-1">Fill in the information below to log your time</p>
</div>
</div>
</div>
 
            {/* Form Content */}
<div className="p-6 text-sm">
<ManualTimeForm
                onSubmit={handleSubmit}
                loading={loading}
                initialTaskId={taskId}
              />
</div>
</div>
 
          {/* Help Section */}
<div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-sm">
<div className="flex items-start gap-3">
<div className="p-2 bg-blue-100 rounded-lg shrink-0">
<svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</div>
<div>
<h3 className="font-semibold text-blue-900 mb-1">Quick Tips</h3>
<ul className="text-blue-800 space-y-0.5">
<li>• Select the task you worked on from the dropdown</li>
<li>• Enter accurate start and end times for better tracking</li>
<li>• Add a brief description to help remember what you did</li>
<li>• Manual entries are marked separately from automatic tracking</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</DashboardLayout>
  );
};
 
export default ManualTimeEntry;