#!/usr/bin/env node

import * as readline from "readline";
import { stdin, stdout } from "node:process";
import { Logger } from "./logger.js";

class ChakraMCPServer {
  private rl: readline.Interface;
  private logger: Logger;
  private serverInfo = {
    name: "Chakra UI MCP Server",
    version: "1.0.0",
    description: "Documentation for Chakra UI v3",
  };

  constructor() {
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
    this.logger = new Logger();
  }

  sendResponse(id: string | number, result: object) {
    const response = {
      jsonrpc: "2.0",
      id: id,
      result: result,
    };

    this.logger.logResponse(response);
    console.log(JSON.stringify(response));
  }

  start() {
    this.rl.on("line", (line) => {
      try {
        const input = line.trim();
        const json = JSON.parse(input);
        this.logger.logRequest(input);

        if (json.jsonrpc === "2.0" && json.method === "initialize") {
          this.sendResponse(json.id, {
            protocolVersion: "2025-03-26",
            capabilities: {
              tools: {
                listChanged: true,
              },
            },
            serverInfo: this.serverInfo,
          });
        }
      } catch (error) {
        console.error("Invalid JSON input:", error);
      }
    });

    this.rl.on("close", () => {
      console.log("Server shutting down...");
      process.exit(0);
    });
  }
}

const server = new ChakraMCPServer();
server.start();
