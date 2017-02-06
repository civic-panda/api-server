import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('causes', req);
  res.sendStatus(200);
})

export default router;