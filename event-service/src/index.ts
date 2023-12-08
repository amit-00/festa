import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import redis from 'lib/redis';
import { createEvent, deleteEventById, getEventById, getEventsByHost, updateEventById } from './models/events';

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
 * @description Get all events by a specific host's phone number.
 * @route GET /:host
 * @param {string} host - The phone number of the host.
 */
app.get('/:host', async (req: Request, res: Response) => {
  try {
    const host = req.params.host;
    const events = await getEventsByHost(host);

    if (!events) {
      return res.status(404).send({ message: 'User does not exist', events });
    }

    return res.status(200).send({ message: 'User data returned', events });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * @description Create an event.
 * @route POST /
 * @param {Object} req.body - The event data.
 */
app.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const token = req.header('x-idempotent-token');
    const exists = await redis.get(token);

    if (exists) {
      const event = getEventById(exists);
      return res.status(200).send({ message: "Event already exists", event});
    }

    const event = await createEvent(body);
    await redis.set(token, event.id);

    return res.status(201).send({ message: "Event document created", event });
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
    const event = await updateEventById(id, body);

    if(!event) {
      return res.status(404).send({ message: "This event doesn't exist", event: null });
    }

    return res.status(200).send({ message: "Event updated", event });
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
    const user = await deleteEventById(id);

    if(!user) {
      return res.status(404).send({ message: "This user doesn't exist", user: null });
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