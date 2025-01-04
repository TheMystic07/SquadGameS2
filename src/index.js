import { server } from "./app.js";
import { connectToDB } from "./db/db.js";

const port = process.env.PORT || 3000;

connectToDB();

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
