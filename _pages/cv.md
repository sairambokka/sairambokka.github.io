---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* **M.S. in Cybersecurity**, University of Maryland, Baltimore County, May 2025
  * GPA: 4.0/4.0
  * Focus: Agentic AI and Security

* **B.Tech. in Electronics and Communications Engineering**, Guru Nanak Institutions Technical Campus, August 2022
  * GPA: 3.6/4.0 (8.84/10)

Work Experience
======
* **Software Engineering Intern**, Corca Research Inc, Remote (Dec 2025 - Present)
  * Expanding Phantom Hints (tab-to-autocomplete) functionality for a SymPy-powered math engine deployed on the frontend via WebAssembly, broadening hint coverage across integrals, derivatives, functions, sets, and other expression types
  * Engineered support for 20+ new mathematical hint categories by extending the SymPy parsing and suggestion pipeline, improving autocomplete accuracy for complex symbolic math workflows
  * Integrated the WebAssembly module on the frontend to ensure seamless rendering and low-latency hint delivery within the browser-based math editor

* **Software Engineering Intern**, RootsID LLC, Baltimore, MD (Feb 2025 - May 2025)
  * Refactored JavaScript/TypeScript pilot codebase into 5+ reusable Node.js packages with modular architecture following OOP principles, reducing development time by 30% and eliminating 200+ lines of duplicate code
  * Orchestrated containerized deployment for 4+ microservices across distributed Linux environments, optimizing inter-service communication and reducing system setup latency by 25% through automated Docker Compose workflows
  * Debugged and resolved 15+ critical issues across 3 Node.js microservices using Git version control and systematic testing, reducing system crashes by 30% and improving user verification success rate
  * Developed secure file upload feature using JavaScript and RESTful API design, enabling 100+ users to process and sign documents in-browser with KERI-based credentials

* **Security Engineering Intern**, Tenable Network Security, Baltimore, MD (June 2024 - August 2024)
  * Developed Python-based Slack bot with asynchronous RESTful API integration for automated lookups across 8 repositories, reducing response time from 3-5 days to under 24 hours and improving efficiency by 80%
  * Containerized application using Docker with comprehensive unit testing in Python, implementing 50+ tests, achieving 95% code coverage for production reliability
  * Built Jenkins-based CI/CD pipeline integrated with Git for automated builds, testing, and deployment, reducing manual effort by 40% and supporting scalable rollout of internal tools

* **Software Engineer**, Concentrix Catalyst, Hyderabad, IN (March 2022 - June 2023)
  * Contributed to the core architecture of 4 full-stack applications, delivering high-impact features across the complete product lifecycle
  * Collaborated with a 5-person cross-functional team to build a dynamic article landing page system in Adobe Experience Manager (AEM)
  * Created modular AEM templates that empowered 8+ non-technical authors to launch high-traffic landing pages independently through dynamic JSON data retrieval
  * Optimized user experience by implementing asynchronous content loading via AJAX, ensuring seamless data rendering and faster page load speeds

Skills
======
* **Languages**
  * Python, TypeScript, JavaScript, HTML5, CSS, Bash

* **Frontend Development**
  * React, Next.js, Tailwind CSS, Context API, React Hooks

* **Backend Development**
  * Node.js, Express.js, FastAPI, RESTful APIs, WebSocket, Socket.IO

* **Infrastructure & Tools**
  * Docker, Docker Compose, Jenkins, Git, CI/CD, Linux, Playwright

* **AI & Security**
  * LangChain, CrewAI, PyTorch, Scapy, CompTIA Security+, Splunk, Nmap
  * Multi-Agent Systems, Model Context Protocol (MCP)
  * Offensive & Defensive Security, Web Application Security
  * OSINT, Vulnerability Assessment, Penetration Testing

Research Interests
======
* AI agents for offensive and defensive security
* Security of agentic AI systems
* Automated vulnerability discovery
* Multi-agent security architectures
* Adversarial AI and prompt injection defense

Projects
======
  <ul>{% for post in site.portfolio reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
