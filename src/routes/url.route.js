import { Router } from "express";
import { createShortUrl, deleteurl, getUrl, getUrls, updateUrl } from "../controllers/url.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route('/').get(getUrls).post(createShortUrl);
router.route('/:shortCode').get(getUrl);
router.route('/:shortCode').patch(updateUrl);
router.route('/:shortCode').delete(deleteurl);

export default router;
