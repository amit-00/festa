import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { createUser, deleteUserById, getUserByPhone, updateUserById } from './models/users';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
  credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`)
})

const MONGO_URL = process.env.DB_CONNECTION_STRING;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

/**
 * @description Get a user by their phone number.
 * @route GET /:phone
 * @param {string} phone - The phone number of the user.
 */
app.get('/:phone', async (req: Request, res: Response) => {
  try {
    const phone = req.params.phone;
    const user = await getUserByPhone(phone);

    if (!user) {
      return res.status(404).send({ message: 'User does not exist', user });
    }

    return res.status(200).send({ message: 'User data returned', user });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * @description Create a user.
 * @route POST /
 * @param {Object} req.body - The user data.
 */
app.post('/', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const existingUser = await getUserByPhone(phone);

    if (existingUser) {
      return res.status(200).send({ message: "User already exists", user: existingUser });
    }

    const user = await createUser({ phone });
    return res.status(201).send({ message: "User document created", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * @description Update a user's data.
 * @route PUT /
 * @param {string} id - The user's id.
 * @param {Object} req.body - The user data.
 */
app.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body;

    const user = await updateUserById(id, body);

    if(!user) {
      return res.status(400).send({ message: "This user doesn't exist", user: null });
    }
    return res.status(200).send({ message: "User updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * @description Delete a user.
 * @route DELETE /
 * @param {string} id - The user's id.
 */
app.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await deleteUserById(id);

    if(!user) {
      return res.status(400).send({ message: "This user doesn't exist", user: null });
    }

    return res.status(200).send({ message: "User deleted", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      message: err.message,
    });
  }
});