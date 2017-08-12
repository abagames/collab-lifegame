import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cells from './cells';

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
});

const listener = app.listen(3000, () => {
  cells.init();
  console.log(`collab-lifegame server ready. port: ${listener.address().port}`);
});
