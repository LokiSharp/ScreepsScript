interface Object {
  methodIsAssignable(): boolean;

  getterIsAssignable: boolean;
}

interface CalledRecord {
  name: string;
  arguments: any[];
  result: any;
}
