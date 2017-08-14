import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cells from './cells';
import * as db from './db';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('docs'));

app.get('/api/cells', (req, res) => {
  res.json(cells.getCells());
});

app.post('/api/cells', (req: any, res) => {
  cells.addUpdatingCells(req.body.cells);
  res.send('');
  setDbSavingTimeout();
});

let dbSavingTimeout;

function setDbSavingTimeout() {
  if (dbSavingTimeout != null) {
    clearTimeout(dbSavingTimeout);
  }
  dbSavingTimeout = setTimeout(saveToDb, 60 * 1000);
}

function saveToDb() {
  cells.saveToDb();
  clearTimeout(dbSavingTimeout);
  dbSavingTimeout = null;
}

const listener = app.listen(process.env.PORT, () => {
  db.init().then(() => {
    console.log(`collab-lifegame server ready. port: ${listener.address().port}`);
  });
});
