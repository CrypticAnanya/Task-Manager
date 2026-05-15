import { env } from "./config/env.js";
import { app } from "./app.js";

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.listen(env.PORT, () => {
  console.log(`Project management API listening on ${env.PORT}`);
});
