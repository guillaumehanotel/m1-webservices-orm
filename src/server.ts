import express, { Request, Response } from 'express';

const app = express();

function middleware(req: Request, res: Response): void {
  const a = 3;
  console.log(a);
  res.end('response end');
}

app.use(middleware);

app.listen(8080);
