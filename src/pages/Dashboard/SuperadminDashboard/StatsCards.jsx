// src/pages/Dashboard/SuperadminDashboard/StatsCards.jsx
import StatsCard from '../../../components/common/StatsCard';

const StatsCards = ({ stats }) => {
  const totalUsers = stats?.users?.total || 0;
  const totalProjects = stats?.projects?.total || 0;
  const totalTasks = stats?.tasks?.total || 0;
  const pendingApprovals = stats?.pendingApprovals || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Users"
        value={totalUsers}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        color="purple"
        subtitle="Active users in system"
      />

      <StatsCard
        title="Total Projects"
        value={totalProjects}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        }
        color="blue"
        subtitle="All projects"
      />

      <StatsCard
        title="Total Tasks"
        value={totalTasks}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        color="green"
        subtitle="All tasks in system"
      />

      <StatsCard
        title="Pending Approvals"
        value={pendingApprovals}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="orange"
        subtitle="Tasks awaiting approval"
      />
    </div>
  );
};

export default StatsCards;