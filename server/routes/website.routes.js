import express from 'express';

import isAuth from '../middlewares/isAuth.js';
import generateWebsite, { changes, depoly, getAll, getWebsiteById, getWebsiteBySlug } from '../controllers/website.controller.js';


const websiteRouter = express.Router();//sare fun auth router usme get ppst sab hota hai

websiteRouter.post("/generate",isAuth,generateWebsite)
websiteRouter.post("/update/:id",isAuth,changes)
websiteRouter.get("/get-by-id/:id",isAuth,getWebsiteById)
websiteRouter.get("/public/:slug",getWebsiteBySlug)
websiteRouter.get("/get-all",isAuth,getAll)
websiteRouter.get("/depoly/:id",isAuth,depoly)



export default websiteRouter;
