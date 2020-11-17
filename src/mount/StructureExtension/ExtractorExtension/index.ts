import ExtractorExtension from "./ExtractorExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [ExtractorExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountExtractor(): void {
  plugins.forEach(plugin => assignPrototype(StructureExtractor, plugin));
}
