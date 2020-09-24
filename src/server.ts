import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecastController';
import * as database from '@src/database';
import { BeachController } from './controllers/beachController';
import { UsersController } from './controllers/usersController';
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  //configs do express
  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  //inicializar os constrollers
  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachController = new BeachController();
    const userController = new UsersController();
    this.addControllers([forecastController, beachController, userController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  //criar um server para os nossos testes
  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening on port:', this.port);
    });
  }
}
