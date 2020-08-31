//arquivo responsavel por adicionar tipos aos tipos globai no namespace NodeJS interface Global para conseguir fazer os teste

declare namespace NodeJS {
  interface Global {
    testRequest: import("supertest").SuperTest<import("supertest").Test>;
  }
}
