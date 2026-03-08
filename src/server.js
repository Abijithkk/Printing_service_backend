const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const PORT = env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
