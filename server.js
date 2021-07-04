import express from "express";
import "express-async-errors";
import cors from "cors";

import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// eslint-disable-next-line no-unused-vars
app.use(function (err, _, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message, stack: err.stack });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
