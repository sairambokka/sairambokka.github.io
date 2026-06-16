---
title: "AI Web Agent"
excerpt: "Intelligent web automation system combining fixed-task automation with AI-powered dynamic agents<br/>"
collection: portfolio
slug: "webagent"
stat: "automation"
tech: ["python", "fastapi", "mcp"]
github: "https://github.com/sairambokka/ai-web-agent"
order: 7
---

## Overview

A dual-approach web automation system featuring both reliable script-based automation and AI-powered dynamic web agents using Claude and Playwright. This project demonstrates the balance between deterministic automation and flexible AI-driven browser interactions.

## Key Features

- **Hybrid Automation**: Core automation for reliable, repeatable tasks with AI layer for dynamic scenarios
- **Multiple Interfaces**: FastAPI endpoints, CLI, and MCP integration for flexible deployment
- **Custom Tool Building**: Full control over browser automation rather than relying solely on pre-built tools
- **Error Handling**: Robust retry logic, timeouts, and observability for production-ready automation

## Architecture

- **Core Automation** (`core_automation.py`): Script-based automation for tasks like product searches
- **AI Agent** (`agent.py`, `agent_cli.py`): Claude-powered intelligent browser control
- **MCP Integration** (`agent_mcp.py`): Model Context Protocol support for advanced workflows

## Technologies

- Python (100%)
- Playwright (browser automation)
- Claude/Anthropic API
- LangChain
- FastAPI
- Model Context Protocol (MCP)

## Applications

- E-commerce automation
- Data extraction from dynamic websites
- Automated testing scenarios
- Research and competitive analysis

[View on GitHub](https://github.com/sairambokka/ai-web-agent)
