import { config } from "./config";
import app from "./app";
const port=config.port

app.listen(port,()=>console.log(`Gateway Service running in ${port}`))