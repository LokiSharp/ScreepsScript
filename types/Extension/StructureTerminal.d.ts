interface StructureTerminal {
  addTask(
    resourceType: ResourceConstant,
    amount: number,
    mod?: TerminalModes,
    channel?: TerminalChannels,
    priceLimit?: number
  ): void;
  add(
    resourceType: ResourceConstant,
    amount: number,
    mod?: TerminalModes,
    channel?: TerminalChannels,
    priceLimit?: number
  ): string;
  removeByType(type: ResourceConstant, mod: TerminalModes, channel: TerminalChannels): void;
  remove(index: number): string;
  show(): string;
  // 平衡 power
  balancePower(): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_NAME_EXISTS | ERR_NOT_FOUND;
}
