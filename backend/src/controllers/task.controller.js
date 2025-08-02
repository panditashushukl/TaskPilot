import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Task } from "../models/tasks.models.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body

  if (!title || !description || !assignedTo) {
    throw new ApiError(400, "Title, description, and assignedTo are required")
  }

  // Check if assigned user exists
  const assignedUser = await User.findById(assignedTo)
  if (!assignedUser) {
    throw new ApiError(404, "Assigned user not found")
  }

  // Check if user is admin or assigning to themselves
  if (req.user.role !== "admin" && req.user._id.toString() !== assignedTo) {
    throw new ApiError(403, "You can only assign tasks to yourself")
  }

  const task = await Task.create({
    title,
    description,
    status: status || "pending",
    priority: priority || "medium",
    dueDate: new Date(dueDate),
    assignedTo
  })

  const createdTask = await Task.findById(task._id).populate("assignedTo", "username fullName email")

  return res.status(201).json(
    new ApiResponse(201, createdTask, "Task created successfully")
  )
})

// Get all tasks with filtering, sorting, and pagination
const getAllTasks = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    search = "", 
    status = "", 
    priority = "", 
    assignedTo = "",
    sortBy = "createdAt", 
    sortOrder = "desc" 
  } = req.query

  const query = {}

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ]
  }

  // Status filter
  if (status) {
    query.status = status
  }

  // Priority filter
  if (priority) {
    query.priority = priority
  }

  // Assigned to filter
  if (assignedTo) {
    query.assignedTo = assignedTo
  }

  // If user is not admin, only show their tasks
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id
  }

  const sortOptions = {}
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const tasks = await Task.find(query)
    .populate("assignedTo", "username fullName email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))

  const total = await Task.countDocuments(query)

  return res.status(200).json(
    new ApiResponse(200, {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Tasks retrieved successfully")
  )
})

// Get task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  const task = await Task.findById(taskId).populate("assignedTo", "username fullName email")

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has access to this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo._id.toString()) {
    throw new ApiError(403, "Access denied")
  }

  return res.status(200).json(
    new ApiResponse(200, task, "Task retrieved successfully")
  )
})

// Update task
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { title, description, status, priority, dueDate, assignedTo } = req.body

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has permission to update this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "You can only update tasks assigned to you")
  }

  // If assigning to someone else, check if user is admin
  if (assignedTo && req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can reassign tasks")
  }

  // If assigning to someone else, verify the user exists
  if (assignedTo) {
    const assignedUser = await User.findById(assignedTo)
    if (!assignedUser) {
      throw new ApiError(404, "Assigned user not found")
    }
  }

  const updateFields = {}
  if (title) updateFields.title = title
  if (description) updateFields.description = description
  if (status) updateFields.status = status
  if (priority) updateFields.priority = priority
  if (dueDate) updateFields.dueDate = new Date(dueDate)
  if (assignedTo) updateFields.assignedTo = assignedTo

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    updateFields,
    { new: true }
  ).populate("assignedTo", "username fullName email")

  return res.status(200).json(
    new ApiResponse(200, updatedTask, "Task updated successfully")
  )
})

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has permission to delete this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "You can only delete tasks assigned to you")
  }

  await Task.findByIdAndDelete(taskId)

  return res.status(200).json(
    new ApiResponse(200, {}, "Task deleted successfully")
  )
})

// Upload document to task
const uploadDocument = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has permission to upload documents to this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "You can only upload documents to tasks assigned to you")
  }

  if (!req.file) {
    throw new ApiError(400, "Document file is required")
  }

  const document = await uploadOnCloudinary(req.file.path)

  if (!document) {
    throw new ApiError(500, "Error uploading document")
  }

  task.documents.push(document.url)
  await task.save()

  const updatedTask = await Task.findById(taskId).populate("assignedTo", "username fullName email")

  return res.status(200).json(
    new ApiResponse(200, updatedTask, "Document uploaded successfully")
  )
})

// Remove document from task
const removeDocument = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { documentUrl } = req.body

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has permission to remove documents from this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "You can only remove documents from tasks assigned to you")
  }

  const documentIndex = task.documents.indexOf(documentUrl)
  if (documentIndex === -1) {
    throw new ApiError(404, "Document not found in task")
  }

  task.documents.splice(documentIndex, 1)
  await task.save()

  const updatedTask = await Task.findById(taskId).populate("assignedTo", "username fullName email")

  return res.status(200).json(
    new ApiResponse(200, updatedTask, "Document removed successfully")
  )
})

// Get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
  const { assignedTo } = req.query

  const query = {}
  
  // If user is not admin, only show their stats
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id
  } else if (assignedTo) {
    query.assignedTo = assignedTo
  }

  const stats = await Task.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] }
        }
      }
    }
  ])

  const result = stats[0] || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  }

  return res.status(200).json(
    new ApiResponse(200, result, "Task statistics retrieved successfully")
  )
})

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  uploadDocument,
  removeDocument,
  getTaskStats
} 