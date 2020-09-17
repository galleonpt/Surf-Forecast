//arquivo responsavel por inicialiazar um servidor para qualquer teste na aplicaçao

import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());
