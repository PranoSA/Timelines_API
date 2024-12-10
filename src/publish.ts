import {
  TableNames,
  SavedTimelineTableColumns,
  PublishedTimelineTableColumns,
  PublishedTimelineEntered,
  PublishedTimelineFetched,
  PublishedTimelineEnteredDatabase,
  PublishedTimelineFetchedDatabase,
} from './types';

import { Request, Response } from 'express';

import db from './db';

const publishHandler = async (req: Request, res: Response) => {
  const { title, description, events } = req.body as PublishedTimelineEntered;

  //check all the fields
  if (!title || !events) {
    console.log('Missing Title, or Events');
    res.status(400).send('Missing required fields');
    return;
  }
  if (!description && !(description === '')) {
    console.log('Missing Description');
    res.status(400).send('Missing required fields');
    return;
  }

  //for each event, check all the fields
  for (const event of events) {
    if (!event.title || !event.year) {
      console.log('Missing Event Fields');
      res.status(400).send('Missing required fields');
      return;
    }
    //test if description is a field - a empty  string is valid!
    //an empty field however, is not valid
    if (!event.description && !(event.description === '')) {
      console.log('Missing Event Description');
      res.status(400).send('Missing required fields');
      return;
    }
  }

  const publisher = res.locals.user;

  if (!publisher) {
    res.status(401).send('Unauthorized');
    return;
  }

  const events_json = JSON.stringify(events);

  const new_timeline: PublishedTimelineEnteredDatabase = {
    title,
    description,
    publisher,
    //created_at: new Date(),
    // updated_at: new Date(),
    events: events_json,
  };

  //if any other timeline, with the same publisher andt itle exists, delete it first
  try {
    const results = await db(TableNames.published_timelines)
      .select('*')
      .where('publisher', publisher)
      .andWhere('title', title);

    if (results.length > 0) {
      await db(TableNames.published_timelines)
        .where('publisher', publisher)
        .andWhere('title', title)
        .del();
    }
  } catch (err) {
    console.error('Error deleting existing timeline:', err);
    res.status(500).send('Error saving timeline');
    return;
  }

  //insert into db
  try {
    const results = await db(TableNames.published_timelines)
      .insert(new_timeline)
      .returning('*');
    res.json(results[0]);
  } catch (err) {
    console.error('Error saving timeline:', err);
    res.status(500).send('Error saving timeline');
  }
};

//search published timelines, using LIKE and term query parameter
const searchHandler = async (req: Request, res: Response) => {
  const { term } = req.query;

  if (!term) {
    res.status(400).send('Missing search term');
    return;
  }

  try {
    const results = await db(TableNames.published_timelines)
      .select('*')
      .where('title', 'like', `%${term}%`)
      .orWhere('description', 'like', `%${term}%`);

    res.json(results);
  } catch (err) {
    console.error('Error searching timelines:', err);
    res.status(500).send('Error searching timelines');
  }
};

//get the published timelines from the user
const getPublishedTimelines = async (publisher: string) => {
  try {
    const results = await db(TableNames.published_timelines)
      .select('*')
      .where('publisher', publisher);

    return results;
  } catch (err) {
    console.error('Error fetching published timelines:', err);
    return [];
  }
};

//get your own published timelines
const getPublishedHandler = async (req: Request, res: Response) => {
  const publisher = res.locals.user;

  if (!publisher) {
    res.status(401).send('Unauthorized');
    return;
  }

  const results = await getPublishedTimelines(publisher);

  res.json(results);
};

//get a particular user's published timelines
const getPublishedUserHandler = async (req: Request, res: Response) => {
  const { publisher } = req.params;

  const results = await getPublishedTimelines(publisher);

  res.json(results);
};

export default publishHandler;

export { searchHandler, getPublishedHandler, getPublishedUserHandler };
