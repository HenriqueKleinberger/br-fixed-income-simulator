import express from "express";

import FixedIncomeController from "./controllers/FixedIncomeController.js";

const fixedIncomeController = new FixedIncomeController();

const routes = express.Router();

routes.get("/fixed-income", fixedIncomeController.get);
routes.get("/compare", fixedIncomeController.compare);

export default routes;
