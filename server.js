const app = require("./src/app");
const config = require("./src/config");

app.listen(config.port, () => {
    console.log(
        `Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`
    );
});
