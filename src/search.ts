import db from './db';
import { Request, Response, NextFunction } from 'express';

const search = async (query: string, offset: number) => {
  try {
    const results = await db.raw(`SELECT * FROM search('${query}')`);
    return results.rows;
  } catch (err) {
    console.error('Error executing search query:', err);
    return [];
  }
};

const searchHandler = async (req: Request, res: Response) => {
  const { query, offset } = req.query;
  if (!query) {
    res.status(400).send('Missing query parameter');
    return;
  }

  const offset_val = parseInt(offset as string);

  const results = await search(query as string, offset_val);
  res.json(results);
};

//keep in mind - you do not need to ba authenticated to search
// only to publish and save timelines

export default searchHandler;
