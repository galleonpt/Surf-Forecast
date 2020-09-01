import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecastController';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  //configs do express
  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  //inicializar os constrollers
  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  //criar um server para os nossos testes
  public getApp(): Application {
    return this.app;
  }
}
