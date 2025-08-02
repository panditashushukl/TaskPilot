import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
  registerUser,
  loginUser,
  loggedOutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js"

const router = Router()

// Public routes
router.route("/register").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
)

router.route("/login").post(loginUser)

// Protected routes
router.use(verifyJWT)

router.route("/logout").post(loggedOutUser)

// User CRUD operations (admin only for some operations)
router.route("/")
  .get(getAllUsers)

router.route("/:userId")
  .get(getUserById)
  .put(updateUser)
  .delete(verifyAdmin, deleteUser)

export default router