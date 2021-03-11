import { allPlain, allSwamp, allWall } from "../integration/utils/usefulTerrains";
import TerrainMatrix from "../integration/utils/terrainMatrix";

describe("terrainMatrix", () => {
  it("是否能序列化、反序列化 TerrainMatrix", () => {
    const serializedTerrainAllPlain = allPlain;
    const unserializedTerrainAllPlain = TerrainMatrix.unserialize(serializedTerrainAllPlain);
    const serializedTerrainAllWall = allWall;
    const unserializedTerrainAllWall = TerrainMatrix.unserialize(serializedTerrainAllWall);
    const serializedTerrainAllSwamp = allSwamp;
    const unserializedTerrainAllSwamp = TerrainMatrix.unserialize(serializedTerrainAllSwamp);

    expect(serializedTerrainAllPlain.length).toEqual(2500);
    expect(serializedTerrainAllWall.length).toEqual(2500);
    expect(serializedTerrainAllSwamp.length).toEqual(2500);

    expect(unserializedTerrainAllPlain).toBeDefined();
    expect(unserializedTerrainAllWall).toBeDefined();
    expect(unserializedTerrainAllSwamp).toBeDefined();

    for (let y = 0; y < 50; y += 1) {
      for (let x = 0; x < 50; x += 1) {
        expect(unserializedTerrainAllPlain.get(x, y)).toEqual("plain");
        expect(unserializedTerrainAllWall.get(x, y)).toEqual("wall");
        expect(unserializedTerrainAllSwamp.get(x, y)).toEqual("swamp");
      }
    }

    expect(unserializedTerrainAllPlain.serialize()).toEqual(serializedTerrainAllPlain);
    expect(unserializedTerrainAllWall.serialize()).toEqual(serializedTerrainAllWall);
    expect(unserializedTerrainAllSwamp.serialize()).toEqual(serializedTerrainAllSwamp);
  });
});
