//arquivo responsavel por inicialiazar um servidor para qualquer teste na aplicaçao

import { SetupServer } from "@src/server";
import supertest from "supertest";

beforeAll(() => {
  const server = new SetupServer();
  server.init();

  global.testRequest = supertest(server.getApp());
});
