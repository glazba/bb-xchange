import { Router } from "express";
import {
    createNewItem,
    getItems,
    getItem,
    getMyItems,
    updateItem,
    deleteItem,
    uploadImages,
    getItemImages,
    setItemImageAsCover,
    deleteItemImage
} from "../controllers/itemController"; import { authMiddleware } from "../middleware/authMiddleware";

import { uploadItemImages } from "../middleware/uploadItemImagesMiddleware";

const router = Router();

router.post("/", authMiddleware, createNewItem);

router.get("/", getItems);

router.get("/me", authMiddleware, getMyItems);

router.get("/:id", getItem);

router.put("/:id", authMiddleware, updateItem);

router.patch("/images/:imageId/cover", authMiddleware, setItemImageAsCover);

router.delete("/:id", authMiddleware, deleteItem);

//! Upload item images
router.post(
    "/:id/images",
    authMiddleware,
    uploadItemImages.array(
        "images",
        5
    ),
    uploadImages
);

//! Get item images
router.get(
    "/:id/images",
    getItemImages
);

//! Delete item image
router.delete(
    "/images/:imageId",
    authMiddleware,
    deleteItemImage
);

export default router;