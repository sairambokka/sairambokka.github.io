---
title: "CTF Solver Agent"
excerpt: "AI-powered agent for solving Capture The Flag challenges using LangChain and security tools<br/>"
collection: portfolio
slug: "ctf"
stat: "agentic"
tech: ["langchain", "nmap"]
github: "https://github.com/sairambokka/ctf-solver-langchain"
order: 5
---

## Overview

A conversational AI agent specialized in solving Capture The Flag (CTF) challenges, particularly web exploitation scenarios. This prototype demonstrates how AI agents can autonomously perform security assessments by combining local shell commands with remote access to Kali Linux security tools.

## Key Features

- **Autonomous Tool Selection**: Agent intelligently selects appropriate security tools based on the challenge type
- **Hybrid Architecture**: Combines basic utilities (curl, wget) locally with advanced scanning tools (nikto, sqlmap, nmap) via MCP server
- **Memory & Context**: Maintains conversation history to inform decision-making throughout the exploitation workflow
- **Specialized Prompting**: Custom prompts designed for reconnaissance, enumeration, and exploitation phases

## Technologies

- Python (97.2%)
- LangChain & LangGraph
- Model Context Protocol (MCP)
- Kali Linux security tools integration
- Docker

## Use Cases

- Automated CTF challenge solving
- Security reconnaissance automation
- Web application vulnerability assessment
- Educational tool for learning offensive security

[View on GitHub](https://github.com/sairambokka/ctf-solver-langchain)
