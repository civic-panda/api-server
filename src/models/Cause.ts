import db from '../db/schema';
import { Table, knexInstance } from '../db/knex';

type ReturnedColumns = 'id' | 'name' | 'callToAction' | 'blurb' | 'brandColor' | 'logoImage' | 'heroImage' | 'placeholderImage' | 'summary' | 'facts' | 'reading' | 'parent' | 'published' | 'createdAt' | 'updatedAt';
const returnedColumns: ReturnedColumns[] = [
  'id', 'name', 'callToAction', 'blurb', 'brandColor', 'logoImage', 'heroImage',
  'placeholderImage', 'summary', 'facts', 'reading', 'parent', 'published', 'createdAt', 'updatedAt'
]
const Cause = new Table<db.causes, ReturnedColumns>('causes', returnedColumns);

const getUnsubscribed = (userId: string) => {
  return knexInstance('causes')
    .whereNotExists(
      knexInstance
        .select('*')
        .from('causes_roles_users as cru')
        .where('cru.userId', userId)
        .andWhereRaw('"causeId" = causes.id')
    )
}

const getAll = () => {
  return knexInstance
    .select('*')
    .from('causes')
}

export default {
  getAll,
  getUnsubscribed,
  create: Cause.create,
  find: Cause.find,
  findOne: Cause.findOne,
  update: Cause.update,
  destroy: Cause.destroy,
};
