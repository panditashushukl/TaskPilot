import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  uploadDocument,
  removeDocument,
  getTaskStats
} from "../controllers/task.controller.js"

const router = Router()

// Apply JWT verification to all task routes
router.use(verifyJWT)

// Task CRUD operations
router.route("/")
  .post(createTask)
  .get(getAllTasks)

router.route("/stats")
  .get(getTaskStats)

router.route("/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask)

// Document upload routes
router.route("/:taskId/documents")
  .post(upload.single("document"), uploadDocument)
  .delete(removeDocument)

export default router 