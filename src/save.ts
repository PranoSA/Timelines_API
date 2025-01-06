import {
  SavedTimelineFetched,
  SavedTimelineEntered,
  TableNames,
  PublishedTimelineFetched,
  PublishedTimelineEntered,
  Timeline,
  TimeEvent,
  SavedTimelineTableColumns,
  SavedTimelineDatabase,
  SavedTimelinesFetchedDatabase,
} from './types';

import { Request, Response, NextFunction } from 'express';

import db from './db';

const saveHandler = async (req: Request, res: Response) => {
  const { title, description, timelines } = req.body as SavedTimelineEntered;

  try {
    //check all the fields
    if (!title || !description || !timelines) {
      console.log(
        'Title',
        title,
        'Description',
        description,
        'Timelines',
        timelines
      );
      console.log('Missing Title, Description, or Timelines');
      res.status(400).send('Missing required fields');
      return;
    }

    //for each timeline, check all the fields
    for (const timeline of timelines) {
      if (!timeline.title || !timeline.events) {
        console.log('Missing Timeline Fields');
        console.log('Timeline', timeline);
        res.status(400).send('Missing required fields');
        return;
      }
      //make sure timeline has description, can be empty string - but has to exist as a field
      if (!timeline.description && !(timeline.description === '')) {
        console.log('Missing Timeline Description');
        res.status(400).send('Missing required fields');
        return;
      }

      //for each event, check all the fields
      for (const event of timeline.events) {
        console.log('Event', event);
        if (!event.title || !event.year) {
          console.log('Missing Event Fields');
          res.status(400).send('Missing required fields');
          return;
        }
        // the description can be an empty string, but it has to exist as a field
        if (!event.description && !(event.description === '')) {
          console.log('Missing Event Description');
          res.status(400).send('Missing required fields');
          return;
        }
      }
    }

    const user_id = res.locals.user;

    if (!user_id) {
      console.log('No user id');
      res.status(401).send('Unauthorized');
      return;
    }
    const json_timelines = JSON.stringify(timelines);

    const new_timeline: SavedTimelineDatabase = {
      title,
      description,
      user_id,
      // created_at: new Date(),
      // updated_at: new Date(),
      timelines: json_timelines,
    };
    //insert into db
    const result = await db(TableNames.saved_timelines)
      .returning('*')
      .insert(new_timeline);

    console.log('Result', result);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const getSavedTimelinesHandler = async (req: Request, res: Response) => {
  const user_id = res.locals.user;

  if (!user_id) {
    console.log('No user id');
    res.status(401).send('Unauthorized');
    return;
  }

  const results = await db(TableNames.saved_timelines)
    .where(SavedTimelineTableColumns.user_id, user_id)
    .select('*');

  res.json(results);
};

const removeSavedTimelineHandler = async (req: Request, res: Response) => {
  const user_id = res.locals.user_id;
  const { id } = req.params;

  if (!user_id) {
    res.status(401).send('Unauthorized');
    return;
  }

  const result = await db(TableNames.saved_timelines)
    .where({ id, user_id })
    .delete();

  res.json(result);
};

const editSavedTimelineHandler = async (req: Request, res: Response) => {
  const user_id = res.locals.user;
  const { id } = req.params;
  const { title, description, timelines } = req.body as SavedTimelineEntered;

  if (!title || !description || !timelines) {
    console.log('Missing required fields');
    console.log(
      'Title',
      title,
      'Description',
      description,
      'Timelines',
      timelines
    );
    res.status(400).send('Missing required fields');
    return;
  }

  for (const timeline of timelines) {
    if (!id || !timeline.title || !timeline.events) {
      console.log('Missing Timeline Fields');
      res.status(400).send('Missing required fields');
      return;
    }
    if (!timeline.description && !(timeline.description === '')) {
      console.log('Missing Timeline Description');
      res.status(400).send('Missing required fields');
      return;
    }

    for (const event of timeline.events) {
      if (!event.title || !event.year) {
        console.log('Missing Event Fields');
        console.log('Event', event);
        res.status(400).send('Missing required fields');
        return;
      }
      if (!event.description && !(event.description === '')) {
        console.log('Missing Event Description');
        res.status(400).send('Missing required fields');
        return;
      }
    }
  }

  if (!user_id) {
    res.status(401).send('Unauthorized');
    return;
  }

  const timeline_json = JSON.stringify(timelines);

  const updated_timeline: SavedTimelinesFetchedDatabase = {
    id,
    title,
    description,
    user_id,
    //updated_at: new Date(),
    timelines: timeline_json,
  };

  const result = await db(TableNames.saved_timelines)
    .where({ id, user_id })
    .update(updated_timeline);

  res.json(result);
};

//by id
const getSavedTimelineById = async (req: Request, res: Response) => {
  const user_id = res.locals.user;
  const { id } = req.params;

  /*if (!user_id) {
    res.status(401).send('Unauthorized');
    return;
  }*/

  const result = await db(TableNames.saved_timelines)
    .where({ id /*, user_id */ })
    .select('*');

  res.json(result);
};

export {
  saveHandler,
  getSavedTimelinesHandler,
  removeSavedTimelineHandler,
  editSavedTimelineHandler,
  getSavedTimelineById,
};
