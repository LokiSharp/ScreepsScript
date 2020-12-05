import BaseMock from "./BaseMock";

export function pushMethodCallInfoToCalled(
  target: BaseMock,
  propertyKey: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  descriptor: TypedPropertyDescriptor<Function>
): void {
  const method = descriptor.value;
  descriptor.value = function () {
    const calledRecord = {
      name: propertyKey,
      // eslint-disable-next-line prefer-rest-params
      arguments: [...arguments],
      result: undefined
    };

    if (`${propertyKey}Result` in this) {
      // eslint-disable-next-line prefer-rest-params,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      calledRecord.result = this[`${propertyKey}Result`];
      (this as BaseMock).calledRecords.push(calledRecord);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return this[`${propertyKey}Result`];
    } else {
      // eslint-disable-next-line prefer-rest-params,@typescript-eslint/no-unsafe-assignment
      calledRecord.result = method.apply(this, arguments);
      (this as BaseMock).calledRecords.push(calledRecord);
    }
  };
}
