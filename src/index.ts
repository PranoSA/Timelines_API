/**
Index Document for the server
*/

import express, {
  RequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';

import publishHandler from './publish';

//configure dotenv
import dotenv from 'dotenv';
dotenv.config();

import { searchHandler } from './publish';

import {
  getSavedTimelinesHandler,
  saveHandler,
  editSavedTimelineHandler,
  removeSavedTimelineHandler,
  getSavedTimelineById,
} from './save';

//import searchHandler from './search';

import { verify } from './Authorization';

import cors from 'cors';

const app = express();

app.use(express.json());

//configure cors -> allow http://localhost:3000 to access the server
//also allow https://timeline.compressibleflowcalculator.com

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://timeline.compressibleflowcalculator.com',
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//allow all methods including complex cors
app.use(cors(corsOptions));

//search doesn't need to be authenticated
app.get('/api/v1/search', searchHandler);

//all the following routes need to be authenticated
const auth_middleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer_header = req.headers.authorization;
  const bearer = bearer_header?.split(' ');

  if (!bearer || bearer.length !== 2) {
    console.log('No token');
    res.status(401).send('invalid token...');
    return;
  }

  const token = bearer[1];

  try {
    const decoded = await verify(token); // Replace 'your-secret-key' with your actual secret key

    //set the user in the request context
    //not the body, but the request object
    res.locals.user = decoded.payload.sub;
    //res.locals.email = decoded.payload.

    //@ts-ignore
    if (decoded.payload.email) {
      //@ts-ignore
      res.locals.email = decoded.payload.email;
    }

    //also fill out name
    //@ts-ignore
    if (decoded.payload.name) {
      //@ts-ignore
      res.locals.name = decoded.payload.name;
    }

    //also fill out username
    //@ts-ignore
    if (decoded.payload.preferred_username) {
      //@ts-ignore
      res.locals.username = decoded.payload.preferred_username;
    }

    next();
  } catch (error) {
    console.log('Error verifying token 2', error);
    res.status(401).send('invalid token...');
  }
};

//rest of the routes
app.get('/api/v1/timelines/saved', auth_middleware, getSavedTimelinesHandler);

app.post('/api/v1/timelines/saved', auth_middleware, saveHandler);

app.get('/api/v1/timelines/saved/:id', auth_middleware, getSavedTimelineById);

app.put(
  '/api/v1/timelines/saved/:id',
  auth_middleware,
  editSavedTimelineHandler
);

app.delete(
  '/api/v1/timelines/saved/:id',
  auth_middleware,
  removeSavedTimelineHandler
);

app.post('/api/v1/timelines/publish', auth_middleware, publishHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
