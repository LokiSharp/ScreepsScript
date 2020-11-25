import RoomObjectMock from "./RoomObjectMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class FlagMock extends RoomObjectMock {
  public constructor(id: Id<FlagMock>, x: number, y: number) {
    super(x, y);
    this.id = id;
  }

  public id: Id<FlagMock>;
  public color: ColorConstant;
  public memory: FlagMemory;

  public name: string;
  public secondaryColor: ColorConstant;

  @pushMethodCallInfoToCalled
  public remove(): OK {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public setColor(): OK | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public setPosition(): OK | ERR_INVALID_ARGS {
    return OK;
  }
}
