import colorful from "utils/colorful";
import { createApiHelp } from "./createApiHelp";

export function createModule(module: ModuleDescribe): string {
  const functionList = module.api.map(createApiHelp).join("");

  const html = `<div class="module-container">
        <div class="module-info">
            <span class="module-title">${colorful(module.name, "yellow")}</span>
            <span class="module-describe">${colorful(module.describe, "green")}</span>
        </div>
        <div class="module-api-list">${functionList}</div>
    </div>`;

  return html.replace(/\n/g, "");
}
