import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
  json,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getCorsConfig } from './cors';
import { morganMiddleware } from './logger';

export abstract class CoreApp {
  protected _app: Express;
  protected router: Router;

  constructor() {
    this._app = express();
    this._app.use(json());
    this._app.use(
      (err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError) {
          return res.status(400).send({ message: err.message });
        }
        next();
      }
    );

    this._app.use(cors(getCorsConfig()));
    this._app.use(helmet({}));
    this._app.use(morganMiddleware);
    this.init();
  }

  protected init() {
    this.router = Router();
    this._app.use('/api', this.router);
  }

  public get app() {
    return this._app;
  }

  public listen(port: number, callback: () => void) {
    return this._app.listen(port, callback);
  }

  public async close() {
    //
  }
}
