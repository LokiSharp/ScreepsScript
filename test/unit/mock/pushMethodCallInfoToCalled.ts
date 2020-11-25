import BaseMock from "./BaseMock";

export function pushMethodCallInfoToCalled(
  target: BaseMock,
  propertyKey: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  descriptor: TypedPropertyDescriptor<Function>
): void {
  const method = descriptor.value;
  descriptor.value = function () {
    // eslint-disable-next-line prefer-rest-params
    (this as BaseMock).called.push({ [propertyKey]: [...arguments] });
    // eslint-disable-next-line prefer-rest-params
    method.apply(this, arguments);
  };
}
