import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
  getDocumentInfo,
  downloadDocument,
  getTaskDocuments
} from "../controllers/document.controller.js"

const router = Router()

// Apply JWT verification to all document routes
router.use(verifyJWT)

// Document routes
router.route("/tasks/:taskId/documents")
  .get(getTaskDocuments)

router.route("/tasks/:taskId/documents/:documentUrl")
  .get(getDocumentInfo)

router.route("/tasks/:taskId/documents/:documentUrl/download")
  .get(downloadDocument)

export default router 