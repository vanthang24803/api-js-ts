const cors = require("cors");

module.exports = cors({
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true,
});
