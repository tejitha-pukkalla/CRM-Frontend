// // src/pages/Tasks/components/ReassignModal.jsx
// import { useState, useEffect } from 'react';
// import Modal from '../../../components/common/Modal';
// import Select from '../../../components/common/Select';
// import TextArea from '../../../components/common/TextArea';
// import Button from '../../../components/common/Button';
// import taskService  from '../../../services/task.service';
// import { projectService } from '../../../services/project.service';

// const ReassignModal = ({ task, onClose, onReassign }) => {
//   const [formData, setFormData] = useState({
//     newAssignee: '',
//     reason: ''
//   });
//   const [projectMembers, setProjectMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchProjectMembers();
//   }, []);

//   const fetchProjectMembers = async () => {
//     try {
//       const response = await projectService.getProjectMembers(task.projectId._id);
//       // Filter out current assignee and get only members
//       const members = response.data.filter(
//         m => m.userId._id !== task.assignedTo._id && m.roleInProject === 'member'
//       );
//       setProjectMembers(members);
//     } catch (error) {
//       console.error('Error fetching members:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.newAssignee) {
//       setError('Please select a member to reassign');
//       return;
//     }

//     if (!formData.reason.trim()) {
//       setError('Please provide a reason for reassignment');
//       return;
//     }

//     try {
//       setLoading(true);
//       await taskService.reassignTask(task._id, formData);
      
//       if (onReassign) {
//         onReassign();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to reassign task');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title="Reassign Task"
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
//           <p className="text-blue-800">
//             <strong>Current Assignee:</strong> {task.assignedTo.name}
//           </p>
//         </div>

//         <Select
//           label="Reassign To *"
//           name="newAssignee"
//           value={formData.newAssignee}
//           onChange={handleChange}
//           error={error && !formData.newAssignee ? error : ''}
//           disabled={loading}
//         >
//           <option value="">Select Member</option>
//           {projectMembers.map((member) => (
//             <option key={member.userId._id} value={member.userId._id}>
//               {member.userId.name} - {member.userId.email}
//             </option>
//           ))}
//         </Select>

//         <TextArea
//           label="Reason for Reassignment *"
//           name="reason"
//           value={formData.reason}
//           onChange={handleChange}
//           placeholder="Explain why this task is being reassigned..."
//           rows={4}
//           error={error && !formData.reason.trim() ? error : ''}
//           disabled={loading}
//         />

//         {error && formData.newAssignee && formData.reason.trim() && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={loading}
//             className="bg-orange-600 hover:bg-orange-700"
//           >
//             {loading ? 'Reassigning...' : 'Reassign Task'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ReassignModal;



























// src/pages/Tasks/components/ReassignModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Select from '../../../components/common/Select';
import TextArea from '../../../components/common/TextArea';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';
import { projectService } from '../../../services/project.service';

const ReassignModal = ({ task, onClose, onReassign }) => {
  const [formData, setFormData] = useState({
    newAssignee: '',
    reason: ''
  });
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectMembers();
  }, []);

  const fetchProjectMembers = async () => {
    try {
      const response = await projectService.getProjectMembers(task.projectId._id);
      // Filter out only the current assignee, but show ALL roles (member, teamlead, projectlead)
      const members = response.data.filter(
        m => m.userId._id !== task.assignedTo._id
      );
      setProjectMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  // Helper function to get role display name
  const getRoleDisplayName = (roleInProject) => {
    const roleMap = {
      'member': 'Member',
      'teamlead': 'Team Lead',
      'projectlead': 'Project Lead'
    };
    return roleMap[roleInProject] || roleInProject;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newAssignee) {
      setError('Please select a member to reassign');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Please provide a reason for reassignment');
      return;
    }

    try {
      setLoading(true);
      await taskService.reassignTask(task._id, formData);
      
      if (onReassign) {
        onReassign();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reassign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Reassign Task"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-800">
            <strong>Current Assignee:</strong> {task.assignedTo.name}
          </p>
        </div>

        <Select
          label="Reassign To *"
          name="newAssignee"
          value={formData.newAssignee}
          onChange={handleChange}
          error={error && !formData.newAssignee ? error : ''}
          disabled={loading}
        >
          <option value="">Select Member</option>
          {projectMembers.map((member) => (
            <option key={member.userId._id} value={member.userId._id}>
              {member.userId.name} - {getRoleDisplayName(member.roleInProject)} - {member.userId.email}
            </option>
          ))}
        </Select>

        <TextArea
          label="Reason for Reassignment *"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Explain why this task is being reassigned..."
          rows={4}
          error={error && !formData.reason.trim() ? error : ''}
          disabled={loading}
        />

        {error && formData.newAssignee && formData.reason.trim() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Reassigning...' : 'Reassign Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReassignModal;