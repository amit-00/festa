import express, { Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel, getUserById, getUserByPhone, updateUserById } from 'db/users';

const PORT = process.env.PORT || 8080
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

const MONGO_URL = 'mongodb://festaadmin:v8engine@localhost:27017'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.get('/', async (req: Request, res: Response) => {
  res.status(200).send('App is running!');
});

app.get('/auth', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const doesExist = await getUserByPhone(phone);

    return res.status(200).send({ message: "User already exists", exists: !doesExist.$isEmpty });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: 'something went wrong' });
  }
});

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const user = await new UserModel({ phone }).save().then((user) => user.toObject);

    return res.status(200).send({ message: "User document created", user });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: 'something went wrong' });
  }
});

app.put('/update', async (req: Request, res: Response) => {
  try {
    const { id, name, bio, instagram, twitter } = req.body;

    const body = {
      name,
      bio, 
      instagram,
      twitter
    }

    const doesExist = await getUserById(id);

    if(doesExist.$isEmpty) {
      return res.status(400).send({ message: "This user doesn't exist", user: null });
    }

    const user = await updateUserById(id, body);
    return res.status(200).send({ message: "User updated", user });

  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: 'something went wrong' });
  }
});

app.post('/')