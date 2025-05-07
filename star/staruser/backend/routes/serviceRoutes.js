const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/serviceController")
const { verifyToken } = require("../middleware/auth")
const upload = require("../middleware/upload")

// Get all services
router.get("/", serviceController.getAllServices)

// Get service by ID
router.get("/:id", serviceController.getServiceById)


// Get all workers
router.get("/workers", serviceController.getAllWorkers)

// Get workers by service
router.get("/:id/workers", serviceController.getWorkersByService)


// Update worker status
router.patch("/workers/:id/status", verifyToken, serviceController.updateWorkerStatus)

module.exports = router
