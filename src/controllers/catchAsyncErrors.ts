import * as express from 'express';

export const wrapRequestHandler = (fn: express.RequestHandler): express.RequestHandler => (req, res, next) => {
  return fn(req, res, next).catch((err: any) => next({ message: err.message || err, status: err.status || 500 }));
}

export const wrapRequestParamHandler = (fn: express.RequestParamHandler): express.RequestParamHandler => (req, res, next, value, name) => {
  return fn(req, res, next, value, name).catch((err: any) => next({ message: err.message || err, status: err.status || 500 }));
}
