import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../store/slices/uiSlice';
import { deleteTask } from '../../store/slices/taskSlice';

const TaskCard = ({ task, compact = false, showActions = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = React.useState(false);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'in_progress':
        return <Clock size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} />;
      case 'medium':
        return <AlertTriangle size={16} />;
      case 'low':
        return <CheckCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    dispatch(openModal('editTask'));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(task._id));
    }
    setShowMenu(false);
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
      compact ? 'p-4' : 'p-6'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link
              to={`/tasks/${task._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate"
            >
              {task.title}
            </Link>
            {isOverdue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                Overdue
              </span>
            )}
          </div>

          {!compact && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>

            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{task.assignedTo?.fullName || task.assignedTo?.username}</span>
            </div>

            {task.documents && task.documents.length > 0 && (
              <div className="flex items-center space-x-1">
                <FileText size={14} />
                <span>{task.documents.length} document{task.documents.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
            </span>

            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1 capitalize">{task.priority}</span>
            </span>
          </div>
        </div>

        {showActions && (
          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <Link
                    to={`/tasks/${task._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <FileText size={16} className="mr-2" />
                    View Details
                  </Link>
                  
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Task
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskCard; 