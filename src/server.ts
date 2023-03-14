import { envolvirements } from "./config";
import app from "./app";

const { API_PORT, API_BASE_URL } = envolvirements;

app.listen(API_PORT, () => {
  console.log(`Api Rest runing in ${API_BASE_URL}:${API_PORT}`);
});

export default app;
