import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class StoreMock extends BaseMock {}

/**
 * 伪造一个 Store
 * @param props 属性
 */
export const getMockStore = getMock<Store<ResourceConstant, false>>(StoreMock);
