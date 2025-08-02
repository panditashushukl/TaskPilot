import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  X,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { fetchTaskById, updateTask, deleteTask, uploadDocument, removeDocument } from '../../store/slices/taskSlice';
import { openModal } from '../../store/slices/uiSlice';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }
  }, [dispatch, taskId]);

  const handleEdit = () => {
    dispatch(openModal('editTask'));
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTask({ taskId, taskData: { status: newStatus } })).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await dispatch(updateTask({ taskId, taskData: { priority: newPriority } })).unwrap();
    } catch (error) {
      console.error('Failed to update task priority:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await dispatch(uploadDocument({ taskId, file })).unwrap();
      } catch (error) {
        console.error('Failed to upload document:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveDocument = async (documentUrl) => {
    try {
      await dispatch(removeDocument({ taskId, documentUrl })).unwrap();
    } catch (error) {
      console.error('Failed to remove document:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'in_progress':
        return 'bg-warning-100 text-warning-800';
      case 'pending':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-100 text-danger-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const isOverdue = currentTask && new Date(currentTask.dueDate) < new Date() && currentTask.status !== 'completed';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h2>
        <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/tasks')} variant="primary">
          <ArrowLeft size={16} className="mr-2" />
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentTask.title}</h1>
            {isOverdue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800 mt-2">
                Overdue
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleEdit} variant="outline">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button onClick={() => setShowDeleteModal(true)} variant="danger">
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{currentTask.description}</p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button variant="outline" size="sm" disabled={uploading}>
                  <Upload size={16} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </label>
            </div>
            
            {currentTask.documents && currentTask.documents.length > 0 ? (
              <div className="space-y-3">
                {currentTask.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Document {index + 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new URL(document).pathname.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleRemoveDocument(document)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents attached</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
            
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="select"
                value={currentTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                className="select"
                value={currentTask.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Current Status Display */}
            <div className="space-y-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentTask.status)}`}>
                {currentTask.status === 'completed' && <CheckCircle size={16} className="mr-2" />}
                {currentTask.status === 'in_progress' && <Clock size={16} className="mr-2" />}
                {currentTask.status === 'pending' && <Clock size={16} className="mr-2" />}
                {currentTask.status.replace('_', ' ')}
              </span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentTask.priority)}`}>
                {currentTask.priority === 'high' && <AlertTriangle size={16} className="mr-2" />}
                {currentTask.priority === 'medium' && <AlertTriangle size={16} className="mr-2" />}
                {currentTask.priority === 'low' && <CheckCircle size={16} className="mr-2" />}
                {currentTask.priority} Priority
              </span>
            </div>
          </div>

          {/* Task Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Due Date</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(currentTask.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Assigned To</p>
                  <p className="text-sm text-gray-600">
                    {currentTask.assignedTo?.fullName || currentTask.assignedTo?.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Documents</p>
                  <p className="text-sm text-gray-600">
                    {currentTask.documents?.length || 0} attached
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(currentTask.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetail; 