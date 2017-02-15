import * as pages from './components/pages';
// import { auth } from './modules'

const scrollToTop = () => window.scrollTo(0, 0);

const requireAuth = (_store: any) => (_nextState: any, _replace: any) => {
  // const state = store.getState();
  // if (!auth.selectors.isLoggedIn(state)) {
  //   replace({ pathname: '/' });
  // }
};

function siteRoutes(store: any) {
  return {
    path: '/',
    name: 'splash',
    component: pages.PageWrapper,
    indexRoute: { component: pages.IndexRoute },
    onChange: scrollToTop,
    childRoutes: [
      { name: 'volunteers', path: 'volunteers', component: pages.Volunteers, onEnter: requireAuth(store) },
      { name: 'causes', path: 'causes', component: pages.Causes, onEnter: requireAuth(store) },
      { name: 'cause', path: 'causes/:causeId', component: pages.Cause, onEnter: requireAuth(store) },
      { name: 'tasks', path: 'tasks', component: pages.Tasks, onEnter: requireAuth(store) },
      { name: 'task', path: 'tasks/:taskId', component: pages.Task, onEnter: requireAuth(store) },
    ],
  };
}

export default (store: any) => {
  return siteRoutes(store);
};
