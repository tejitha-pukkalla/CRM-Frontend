import { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import TextArea from '../../../components/common/TextArea';
import Select from '../../../components/common/Select';
import DatePicker from '../../../components/common/DatePicker';
import Button from '../../../components/common/Button';
import { projectService } from '../../../services/project.service';
import { userService } from '../../../services/user.service';

const TaskForm = ({ initialData, onSubmit, loading, onCancel, isEditMode = false}) => {
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    assignedTo: '',
    estimatedTime: '',
    dueDate: '',
    priority: 'medium',
    tags: '',
    ...initialData
  });

  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      fetchProjectMembers(formData.projectId);
    }
  }, [formData.projectId]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects({ limit: 100 });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };


  const fetchProjectMembers = async (projectId) => {
  try {
    // ✅ USE NEW API - Get ALL assignable members (member + projectlead + teamlead)
    const response = await projectService.getAssignableMembers(projectId);
    
    // ✅ NO FILTER - Keep all roles
    setProjectMembers(response.data);
  } catch (error) {
    console.error('Error fetching project members:', error);
  }
};



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to a member';
    if (!formData.estimatedTime || formData.estimatedTime <= 0) {
      newErrors.estimatedTime = 'Valid estimated time is required';
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // Convert tags string to array
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const submitData = {
      ...formData,
      tags: tagsArray,
      estimatedTime: parseFloat(formData.estimatedTime)
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Selection */}
      <Select
        label="Project *"
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        error={errors.projectId}
        disabled={loading}
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </Select>

      {/* Title */}
      <Input
        label="Task Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter task title"
        disabled={loading}
      />

      {/* Description */}
      <TextArea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Describe the task in detail"
        rows={5}
        disabled={loading}
      />

      {/* Assign To */}
      <Select
        label="Assign To *"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        error={errors.assignedTo}
        disabled={loading || !formData.projectId}
      >
        <option value="">Select Member</option>
        
       {projectMembers.map((member) => (
          <option key={member.userId._id || member.userId} value={member.userId._id || member.userId}>
            {member.userId?.name || member.name} - {member.roleInProject.toUpperCase()} - {member.userId?.email || member.email}
          </option>
        ))}
      </Select>

      {/* Row: Estimated Time & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Estimated Time (hours) *"
          name="estimatedTime"
          type="number"
          step="0.5"
          min="0.5"
          value={formData.estimatedTime}
          onChange={handleChange}
          error={errors.estimatedTime}
          placeholder="e.g., 8"
          disabled={loading}
        />

        <DatePicker
          label="Due Date *"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          min={new Date().toISOString().split('T')[0]}
          disabled={loading}
        />
      </div>

      {/* Priority */}
      <Select
        label="Priority *"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>

      {/* Tags */}
      <Input
        label="Tags (comma-separated)"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="e.g., frontend, urgent, bug-fix"
        disabled={loading}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Task' : 'Create Task')
          }
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;