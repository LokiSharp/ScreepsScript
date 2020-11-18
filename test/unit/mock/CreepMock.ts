export default class CreepMock {
  public isDoing: boolean;
  public work(): void {
    this.isDoing = true;
  }

  public constructor() {
    this.isDoing = false;
  }
}
