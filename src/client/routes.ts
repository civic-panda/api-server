import * as pages from './components/pages';
import * as redux from 'react-redux';
import { AppState, auth, user } from './modules'

const scrollToTop = () => window.scrollTo(0, 0);

const refreshData = (store: redux.Store<AppState>) => (_nextState: any, _replace: any) => {
  // TODO more fine-grained data refreshing
  const state = store.getState();
  const userId = auth.selectors.userId(state);
  store.dispatch(user.load(userId));
};

function siteRoutes(store: any) {
  return {
    path: '/',
    name: 'splash',
    component: pages.PageWrapper,
    indexRoute: { component: pages.IndexRoute },
    onChange: scrollToTop,
    childRoutes: [
      { name: 'volunteers', path: 'volunteers', component: pages.Volunteers, onEnter: refreshData(store) },
      { name: 'causes', path: 'causes', component: pages.Causes, onEnter: refreshData(store) },
      { name: 'cause', path: 'causes/:causeId', component: pages.Cause, onEnter: refreshData(store) },
      { name: 'tasks', path: 'tasks', component: pages.Tasks, onEnter: refreshData(store) },
      { name: 'task', path: 'tasks/:taskId', component: pages.Task, onEnter: refreshData(store) },
    ],
  };
}

export default (store: any) => {
  return siteRoutes(store);
};
