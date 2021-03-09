import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class MarketMock extends BaseMock {
  public credits = 0;
  public incomingTransactions = [];
  public orders = {};
  public outgoingTransactions = [];
}

/**
 * 伪造一个 Market
 * @param props 属性
 */
export const getMockMarket = getMock<Market>(MarketMock);
