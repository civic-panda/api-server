
import * as auth from './auth';
import * as causes from './causes';
import * as permissions from './permissions';
import * as storage from './storage';
import * as tasks from './tasks';
import * as user from './user';

export interface AppState {
  auth: auth.State;
  causes: causes.State;
  storage: storage.State;
  tasks: tasks.State;
  user: user.State;
}

export {
  auth,
  causes,
  permissions,
  storage,
  tasks,
  user,
}
