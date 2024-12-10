import type { Knex } from 'knex';

import {
  TableNames,
  SavedTimelineTableColumns,
  PublishedTimelineTableColumns,
} from '../src/types';

/**
    The First Table will be Published Timelines

    Columns Will Be :
    id : generated uuid
    //title should be indexed for GIN for general text search in postgres
    //right now, I want to do term search against it
    title : string
    description : string
    publisher : string
    created_at : date
    updated_at : date
    events : json
*/

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TableNames.published_timelines, (table) => {
      table
        .uuid(PublishedTimelineTableColumns.id)
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string(PublishedTimelineTableColumns.title).notNullable();
      table.string(PublishedTimelineTableColumns.description).notNullable();
      table.uuid(PublishedTimelineTableColumns.publisher).notNullable();
      table
        .date(PublishedTimelineTableColumns.created_at)
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .date(PublishedTimelineTableColumns.updated_at)
        .notNullable()
        .defaultTo(knex.fn.now());
      table.json(PublishedTimelineTableColumns.events).notNullable();
      //add text search index to title
      table.index(PublishedTimelineTableColumns.title, 'gin');
    })
    .createTable(TableNames.saved_timelines, (table) => {
      table
        .uuid(SavedTimelineTableColumns.id)
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string(SavedTimelineTableColumns.title).notNullable();
      table.uuid(SavedTimelineTableColumns.user_id).notNullable();
      table.string(SavedTimelineTableColumns.description).notNullable();
      table.json(SavedTimelineTableColumns.timelines).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable(TableNames.published_timelines)
    .dropTable(TableNames.saved_timelines);
}
