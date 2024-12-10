/**
 * 
Timelines Can Be Published

They will be associated with a publisher

Or they can be saved
THen they won't be "published"
but will be associated with a user

There is no such thing as a "saved published timeline"
They are either saved or published

Saved Timelines are different - they are composed of arrays of timelines



 */

const TableNames = {
  saved_timelines: 'saved_timelines',
  published_timelines: 'published_timelines',
};

const SavedTimelineTableColumns = {
  id: 'id', //string
  title: 'title', //string
  description: 'description', //string
  user_id: 'user_id', //string
  created_at: 'created_at', //date
  updated_at: 'updated_at', //date
  timelines: 'timelines', //json
};

type SavedTimelineFetched = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  timelines: Timeline[];
};

type SavedTimelinesFetchedDatabase = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  timelines: string;
};

type SavedTimelineEntered = {
  title: string;
  description: string;
  timelines: Timeline[];
  user_id: string;
};

type SavedTimelineDatabase = {
  title: string;
  description: string;
  timelines: string;
  user_id: string;
};

//published timlines are a single timeline
//that you can add to your saved timelines for a session

const PublishedTimelineTableColumns = {
  id: 'id', //string
  title: 'title', //string
  description: 'description', //string
  publisher: 'publisher', //string
  created_at: 'created_at', //date
  updated_at: 'updated_at', //date
  events: 'events', //json
};

type PublishedTimelineFetched = {
  id: string;
  title: string;
  description: string;
  publisher: string;
  events: TimeEvent[];
};

type PublishedTimelineFetchedDatabase = {
  id: string;
  title: string;
  description: string;
  publisher: string;
  created_at?: Date;
  updated_at?: Date;
  events: string;
};

type PublishedTimelineEnteredDatabase = {
  publisher: string;
  title: string;
  description: string;
  events: string;
};

type PublishedTimelineEntered = {
  title: string;
  description: string;
  events: TimeEvent[];
};

type Timeline = {
  id: string;
  title: string;
  description: string;
  events: TimeEvent[];
};

type TimeEvent = {
  title: string;
  description: string;
  year: number;
};

export type {
  SavedTimelineFetched,
  SavedTimelineDatabase,
  SavedTimelineEntered,
  PublishedTimelineFetched,
  PublishedTimelineEntered,
  Timeline,
  TimeEvent,
  PublishedTimelineFetchedDatabase,
  PublishedTimelineEnteredDatabase,
  SavedTimelinesFetchedDatabase,
};

export { TableNames, SavedTimelineTableColumns, PublishedTimelineTableColumns };
