const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const os = require("os");
dotenv.config();
process.env.UV_THREADPOOL_SIZE = os.cpus().length;
const bcrypt = require("bcrypt");
const port = process.env.PORT || 4000;
const compression = require("compression");
const app = express();
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.get("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("This is a password", salt);
  res.send(password.repeat(10000));
});
app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
