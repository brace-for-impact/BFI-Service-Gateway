import { config } from "./config";
import app from "./app";
const port=config.port

console.log(`hi`)
app.listen(port,()=>console.log(`Auth Service running in ${port}`))