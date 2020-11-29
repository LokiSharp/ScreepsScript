import BaseMock from "./BaseMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class MarketMock extends BaseMock {
  public credits: number;
  public incomingTransactions: Transaction[];
  public orders: { [key: string]: Order };
  public outgoingTransactions: Transaction[];

  public constructor() {
    super();
    this.credits = 0;
    this.incomingTransactions = [];
    this.orders = {};
    this.outgoingTransactions = [];
  }

  @pushMethodCallInfoToCalled
  public calcTransactionCost(): number {
    return 0;
  }

  @pushMethodCallInfoToCalled
  public cancelOrder(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public changeOrderPrice(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public createOrder(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public deal(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public extendOrder(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public getAllOrders(): Order[] {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public getHistory(): PriceHistory[] {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public getOrderById(): Order | null {
    return undefined;
  }
}
