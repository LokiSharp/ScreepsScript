import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class MemoryMock extends BaseMock {}

/**
 * 伪造一个 Memory
 * @param props 属性
 */
export const getMockMemory = getMock<Memory>(MemoryMock);
