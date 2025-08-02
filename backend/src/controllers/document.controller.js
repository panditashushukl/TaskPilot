import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Task } from "../models/tasks.models.js"
import { v2 as cloudinary } from "cloudinary"

// Get document info
const getDocumentInfo = asyncHandler(async (req, res) => {
  const { taskId, documentUrl } = req.params

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has access to this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "Access denied")
  }

  // Check if document exists in task
  if (!task.documents.includes(decodeURIComponent(documentUrl))) {
    throw new ApiError(404, "Document not found in task")
  }

  // Extract public ID from Cloudinary URL
  const url = decodeURIComponent(documentUrl)
  const publicId = url.split('/').pop().split('.')[0]

  try {
    // Get resource info from Cloudinary
    const result = await cloudinary.api.resource(publicId)
    
    return res.status(200).json(
      new ApiResponse(200, {
        url: decodeURIComponent(documentUrl),
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
        secureUrl: result.secure_url
      }, "Document info retrieved successfully")
    )
  } catch (error) {
    throw new ApiError(404, "Document not found or inaccessible")
  }
})

// Download document
const downloadDocument = asyncHandler(async (req, res) => {
  const { taskId, documentUrl } = req.params

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has access to this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "Access denied")
  }

  // Check if document exists in task
  const decodedUrl = decodeURIComponent(documentUrl)
  if (!task.documents.includes(decodedUrl)) {
    throw new ApiError(404, "Document not found in task")
  }

  // Extract public ID from Cloudinary URL
  const publicId = decodedUrl.split('/').pop().split('.')[0]

  try {
    // Generate download URL with transformation
    const downloadUrl = cloudinary.url(publicId, {
      flags: "attachment",
      resource_type: "auto"
    })

    return res.status(200).json(
      new ApiResponse(200, {
        downloadUrl,
        originalUrl: decodedUrl
      }, "Download URL generated successfully")
    )
  } catch (error) {
    throw new ApiError(500, "Error generating download URL")
  }
})

// Get all documents for a task
const getTaskDocuments = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  const task = await Task.findById(taskId)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  // Check if user has access to this task
  if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
    throw new ApiError(403, "Access denied")
  }

  const documents = []

  // Get info for each document
  for (const docUrl of task.documents) {
    try {
      const publicId = docUrl.split('/').pop().split('.')[0]
      const result = await cloudinary.api.resource(publicId)
      
      documents.push({
        url: docUrl,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
        secureUrl: result.secure_url
      })
    } catch (error) {
      // If document info can't be retrieved, still include the URL
      documents.push({
        url: docUrl,
        error: "Document info unavailable"
      })
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { documents }, "Task documents retrieved successfully")
  )
})

export {
  getDocumentInfo,
  downloadDocument,
  getTaskDocuments
} 