import { Router } from 'express';

export abstract class Route {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  protected abstract init(): void;

  get routes() {
    return this.router;
  }
}
