const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const documentController = require("../controllers/documentController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("pdf"),
    documentController.uploadDocument
);

router.get(
    "/study-space/:studySpaceId",
    authMiddleware,
    documentController.getDocumentsByStudySpace
);

router.delete(
    "/:id",
    authMiddleware,
    documentController.deleteDocument
);

router.put(
    "/:id",
    authMiddleware,
    documentController.renameDocument
);

router.get(
    "/view/:id",
    authMiddleware,
    documentController.viewDocument
);

module.exports = router;
