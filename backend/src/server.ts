import { createApp } from "./app.js";
import { createDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const database = createDatabase();
const app = createApp(database);

app.listen(env.port, () => {
  console.log(`Doomsday Ready API listening on port ${env.port}`);
});
