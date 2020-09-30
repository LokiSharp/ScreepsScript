import { allPlain, allSwamp, allWall } from "../integration/utils/usefulTerrains";
import TerrainMatrix from "../integration/utils/terrainMatrix";
import { assert } from "chai";

describe("terrainMatrix", () => {
  it("是否能序列化、反序列化 TerrainMatrix", () => {
    const serializedTerrainAllPlain = allPlain;
    const unserializedTerrainAllPlain = TerrainMatrix.unserialize(serializedTerrainAllPlain);
    const serializedTerrainAllWall = allWall;
    const unserializedTerrainAllWall = TerrainMatrix.unserialize(serializedTerrainAllWall);
    const serializedTerrainAllSwamp = allSwamp;
    const unserializedTerrainAllSwamp = TerrainMatrix.unserialize(serializedTerrainAllSwamp);

    assert.equal(serializedTerrainAllPlain.length, 2500);
    assert.equal(serializedTerrainAllWall.length, 2500);
    assert.equal(serializedTerrainAllSwamp.length, 2500);

    assert.isDefined(unserializedTerrainAllPlain);
    assert.isDefined(unserializedTerrainAllWall);
    assert.isDefined(unserializedTerrainAllSwamp);

    for (let y = 0; y < 50; y += 1) {
      for (let x = 0; x < 50; x += 1) {
        assert.equal(unserializedTerrainAllPlain.get(x, y), "plain");
        assert.equal(unserializedTerrainAllWall.get(x, y), "wall");
        assert.equal(unserializedTerrainAllSwamp.get(x, y), "swamp");
      }
    }

    assert.deepEqual(unserializedTerrainAllPlain.serialize(), serializedTerrainAllPlain);
    assert.equal(unserializedTerrainAllWall.serialize(), serializedTerrainAllWall);
    assert.equal(unserializedTerrainAllSwamp.serialize(), serializedTerrainAllSwamp);
  });
});
