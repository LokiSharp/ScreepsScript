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
    return OK;
  }
  @pushMethodCallInfoToCalled
  public changeOrderPrice(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public createOrder(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public deal(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public extendOrder(): ScreepsReturnCode {
    return OK;
  }
  //   @pushMethodCallInfoToCalled
  //   public getAllOrders(): Order[];
  //   @pushMethodCallInfoToCalled
  //   public getHistory(): PriceHistory[];
  //   @pushMethodCallInfoToCalled
  //   public getOrderById(): Order | null;
}
