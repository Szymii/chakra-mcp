import { Logger } from "../logger";

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  execute: (args: object) => Promise<object>;
}

export const tools: Tool[] = [
  {
    name: "getCharts",
    description: "Get the names of available charts",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const fs = await import("fs/promises");
      const path = require("path");
      const chartsDir = path.join(__dirname, "../tmp/charts");

      let chartNames: string[] = [];
      const logger = new Logger();

      try {
        const files = await fs.readdir(chartsDir);
        chartNames = files
          .filter((file: string) => file.endsWith(".md"))
          .map((file: string) => file.replace(/\.md$/, ""));
      } catch (e) {
        logger.log(`Charts from: ${chartsDir}`);
        logger.log(`Error reading charts directory: ${e}`);
        chartNames = ["Could not read charts directory."];
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ names: chartNames }),
          },
        ],
      };
    },
  },
  {
    name: "getComponents",
    description: "Get the names of available components",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const fs = await import("fs/promises");
      const path = require("path");
      const componentsDir = path.join(__dirname, "../tmp/components");
      let componentNames: string[] = [];
      const logger = new Logger();
      try {
        const files = await fs.readdir(componentsDir);
        componentNames = files
          .filter((file: string) => file.endsWith(".md"))
          .map((file: string) => file.replace(/\.md$/, ""));
      } catch (e) {
        logger.log(`Components from: ${componentsDir}`);
        logger.log(`Error reading components directory: ${e}`);
        componentNames = ["Could not read components directory."];
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ names: componentNames }),
          },
        ],
      };
    },
  },
  {
    name: "getMigratingGuideToV3",
    description: "Get migration guides to v3",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const fs = await import("fs/promises");
      const path = require("path");
      const filePath = path.join(
        __dirname,
        "../tmp/migrating-to-v3/migration-to-v3.md"
      );

      let fileContent = "";
      const logger = new Logger();

      try {
        fileContent = await fs.readFile(filePath, "utf-8");
      } catch (e) {
        logger.log(`Migration guide from: ${filePath}`);
        logger.log(`Error reading migration guide: ${e}`);
        fileContent = "Could not read migration guide.";
      }

      return {
        content: [
          {
            type: "text",
            text: fileContent,
          },
        ],
      };
    },
  },
  {
    name: "getStyling",
    description: "Get chapters of styling documentation",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const fs = await import("fs/promises");
      const path = require("path");
      const stylingDir = path.join(__dirname, "../tmp/styling");
      let stylingNames: string[] = [];
      const logger = new Logger();
      try {
        const files = await fs.readdir(stylingDir);
        stylingNames = files
          .filter((file: string) => file.endsWith(".md"))
          .map((file: string) => file.replace(/\.md$/, ""));
      } catch (e) {
        logger.log(`Styling from: ${stylingDir}`);
        logger.log(`Error reading styling directory: ${e}`);
        stylingNames = ["Could not read styling directory."];
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ names: stylingNames }),
          },
        ],
      };
    },
  },
  {
    name: "getTheming",
    description: "Get chapters of theming documentation",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const fs = await import("fs/promises");
      const path = require("path");
      const themingDir = path.join(__dirname, "../tmp/theming");
      let themingNames: string[] = [];
      const logger = new Logger();
      try {
        const files = await fs.readdir(themingDir);
        themingNames = files
          .filter((file: string) => file.endsWith(".md"))
          .map((file: string) => file.replace(/\.md$/, ""));
      } catch (e) {
        logger.log(`Theming from: ${themingDir}`);
        logger.log(`Error reading theming directory: ${e}`);
        themingNames = ["Could not read theming directory."];
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ names: themingNames }),
          },
        ],
      };
    },
  },
];
