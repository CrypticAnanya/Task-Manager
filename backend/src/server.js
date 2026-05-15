import { env } from "./config/env.js";
import { app } from "./app.js";

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.listen(env.PORT, () => {
  console.log(`Project management API listening on ${env.PORT}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
