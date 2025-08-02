import express, { json, urlencoded } from 'express';
import productsRouter from './routes/products/index.js';
import authRoutes from './routes/auth/index.js';

const port = 3000;

const app = express();


app.use(urlencoded({ extended: false })); // Middleware to parse URL-encoded request body
app.use(json());            // Middleware to parse JSON request body

app.get('/', (req, res) => {
    res.send('Hello World! 123')
  });


  
app.use('/products', productsRouter);
app.use('/auth', authRoutes);
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });