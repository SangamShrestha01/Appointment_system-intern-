import express from "express";
import dotenv from "dotenv";
import connectDb from "./database.js";
import ErrorMiddleware from "./middleware/error.js";
import authRoutes from './routes/user.route.js'
import doctorRoutes from './routes/doctor.routes.js'
import bookRoutes from './routes/appointment.routes.js'
import paymentRoutes from './routes/payment.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());

connectDb();


app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/doctor',doctorRoutes)
app.use('/api/v1/book',bookRoutes)
app.use('/api/v1/payment',paymentRoutes)


app.get("/", (req, res) => {
  res.send("MongoDB Atlas connected 🚀");
});


app.use(ErrorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
