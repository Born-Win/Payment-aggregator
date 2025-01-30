import { v4 } from 'uuid';

export abstract class Repository {
  constructor() {}

  generateId() {
    return v4().substring(0, 10);
  }
}
