const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.static("client"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Referencing a function and passing in app being exported all together
// require("./routes/api")(app);

// Referencing multiple functions all being exported seperately
app.use(require("./routes/api.js"))
app.use(require("./routes/html-routes.js"))

app.listen(PORT, function () {
    console.log(`Now listening on port: ${PORT}`);
});
