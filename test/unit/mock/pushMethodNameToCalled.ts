import BaseMock from "./BaseMock";

export function pushMethodNameToCalled(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const method = descriptor.value;
  descriptor.value = function () {
    // eslint-disable-next-line prefer-rest-params
    (this as BaseMock).called.push({ [propertyKey]: [...arguments] });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access, prefer-rest-params
    method.apply(this, arguments);
  };
}
