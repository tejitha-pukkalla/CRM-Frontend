import { formatDistanceToNow } from 'date-fns';

const TimeLogTable = ({ timeLogs, onRefresh }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (timeLogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Logs</h3>
        <p className="text-gray-600">Start tracking time on your tasks to see entries here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* ✅ INFO BANNER */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-start gap-2 text-sm">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-blue-800">
            <p className="font-medium">Duration Calculation</p>
            <p className="text-blue-700 mt-0.5">
              <strong>Active Duration</strong> = Total Time - Pause/Hold Time. 
              Only active work time is counted towards task completion.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Total Duration</div>
                <div className="text-xs font-normal text-gray-400 mt-0.5">(Start to End)</div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Pause/Hold Time</div>
                <div className="text-xs font-normal text-gray-400 mt-0.5">(Excluded)</div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <span>Active Duration</span>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs font-normal text-gray-400 mt-0.5">(Counted)</div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeLogs.map((log) => {
              // Calculate total duration (start to end)
              const totalDuration = log.endTime 
                ? Math.floor((new Date(log.endTime) - new Date(log.startTime)) / 60000)
                : 0;
              
              return (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.taskId?.title || 'Unknown Task'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.taskId?.projectId?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.endTime ? formatDate(log.endTime) : (
                      log.isPaused ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          ⏸️ Paused
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ▶️ Running
                        </span>
                      )
                    )}
                  </td>
                  
                  {/* Total Duration Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {log.endTime ? formatDuration(totalDuration) : '-'}
                    </div>
                  </td>
                  
                  {/* Pause/Hold Duration Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.pauseDuration > 0 ? (
                      <div>
                        <div className="text-sm text-orange-600 font-medium">
                          {formatDuration(log.pauseDuration)}
                        </div>
                        {log.pauseHistory && log.pauseHistory.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {log.pauseHistory.length} pause period{log.pauseHistory.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">0h 0m</span>
                    )}
                  </td>
                  
                  {/* ✅ ACTIVE DURATION (COUNTED) - Highlighted */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start gap-2">
                      <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                        {formatDuration(log.duration || 0)}
                      </div>
                    </div>
                    {/* Show calculation breakdown for completed logs with pauses */}
                    {log.endTime && log.pauseDuration > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDuration(totalDuration)} - {formatDuration(log.pauseDuration)} = {formatDuration(log.duration)}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.entryType === 'automatic' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.entryType}
                    </span>
                    {log.description && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {log.description}
                      </div>
                    )}
                    {log.pauseReason && (
                      <div className="text-xs text-orange-600 mt-1 max-w-xs truncate">
                        Hold: {log.pauseReason}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ SUMMARY FOOTER */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Total Entries: <span className="font-semibold text-gray-900">{timeLogs.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-600">
              Total Active Work Time: 
              <span className="font-bold text-green-600 ml-2">
                {formatDuration(timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0))}
              </span>
            </div>
            <div className="text-gray-600">
              Total Pause/Hold Time: 
              <span className="font-bold text-orange-600 ml-2">
                {formatDuration(timeLogs.reduce((sum, log) => sum + (log.pauseDuration || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLogTable;






