# Workforce Wellbeing Analytics - Agents

This directory contains all the microservice agents that collect and analyze workforce wellbeing indicators.

## Overview

Each agent is a containerized microservice responsible for collecting and transforming specific types of data. Agents communicate securely with the central analytics layer via APIs or message queues.

## Agent Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                              │
│  Calendar │ Email │ Slack │ Jira │ HRIS │ Device │ Survey   │
└──────┬──────┬──────┬──────┬──────┬────────┬────────┬────────┘
       │      │      │      │      │        │        │
       ▼      ▼      ▼      ▼      ▼        ▼        ▼
┌──────────────────────────────────────────────────────────────┐
│                      Agent Layer                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │Agent1│ │Agent2│ │Agent3│ │Agent4│ │Agent5│ │Agent6│     │
│  └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘     │
└──────┼────────┼────────┼────────┼────────┼────────┼─────────┘
       │        │        │        │        │        │
       └────────┴────────┴────────┴────────┴────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Message Queue      │
              │   (Kafka/RabbitMQ)   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Central Analytics  │
              │   API & ML Layer     │
              └──────────────────────┘
```

## Available Agents

### 1. ✅ Calendar Agent
**Status**: Implemented  
**Port**: 8001  
**Purpose**: Analyzes work calendar patterns to detect meeting overload and stress indicators

**Features**:
- Average meeting hours per day
- Back-to-back meetings count
- Free time ratio
- After-hours meeting frequency
- Meeting load trends

**Supported Providers**:
- Google Calendar
- Microsoft Outlook

[📖 Documentation](./calendar-agent/README.md)

---

### 2. 🚧 Communication Agent (Coming Soon)
**Port**: 8002  
**Purpose**: Analyzes email and chat patterns without reading content

**Planned Features**:
- Email/message volume
- Response time patterns
- After-hours communication
- Communication balance

---

### 3. 🚧 Task & Workflow Agent (Coming Soon)
**Port**: 8003  
**Purpose**: Monitors project management tools for workload balance

**Planned Features**:
- Task completion rates
- Workload distribution
- Deadline adherence
- Task-switching frequency

---

### 4. 🚧 Attendance & Shift Agent (Coming Soon)
**Port**: 8004  
**Purpose**: Analyzes work hours and shift patterns

**Planned Features**:
- Working hours vs planned
- Absence patterns
- Shift imbalances

---

### 5. 🚧 Device Activity Agent (Coming Soon)
**Port**: 8005  
**Purpose**: Monitors system-level activity patterns

**Planned Features**:
- Active working hours
- Context switching
- Work intensity patterns

---

### 6. 🚧 Survey & Sentiment Agent (Coming Soon)
**Port**: 8006  
**Purpose**: Collects pulse survey responses

**Planned Features**:
- Mood tracking
- Stress self-ratings
- Engagement metrics

---

## Common Principles

### Privacy-First Design
- ✅ All employee IDs are hashed (SHA-256)
- ✅ No personal content collected
- ✅ Data aggregated and anonymized at source
- ✅ Consent-based integration
- ✅ GDPR-compliant

### Data Format
All agents send data in a standardized format:

```json
{
  "employee_id": "hashed_id",
  "timestamp": "2025-11-07T10:00:00Z",
  "source": "calendar_agent",
  "features": {
    "feature_name": value,
    ...
  }
}
```

### Technology Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Task Queue**: Celery + Redis
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **API Client**: httpx (async)

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Kubernetes (for production)
- Python 3.11+
- Redis

### Quick Start

1. **Choose an agent**:
```bash
cd agents/calendar-agent
```

2. **Copy environment file**:
```bash
cp .env.example .env
# Edit with your credentials
```

3. **Run with Docker Compose**:
```bash
docker-compose up -d
```

4. **Verify it's running**:
```bash
curl http://localhost:8001/health
```

## Deployment

### Docker Compose (Development)
```bash
# Start all agents
docker-compose -f docker-compose.all.yml up -d

# View logs
docker-compose logs -f
```

### Kubernetes (Production)
```bash
# Deploy specific agent
kubectl apply -f calendar-agent/k8s-deployment.yaml

# Check status
kubectl get pods -n wellbeing-analytics
```

## Network Configuration

All agents communicate via a shared Docker network:
```bash
docker network create wellbeing-network
```

Port assignments:
- 8001: Calendar Agent
- 8002: Communication Agent
- 8003: Task & Workflow Agent
- 8004: Attendance & Shift Agent
- 8005: Device Activity Agent
- 8006: Survey & Sentiment Agent

## Monitoring

Each agent includes:
- `/health` endpoint for health checks
- Structured logging
- Kubernetes probes (liveness/readiness)
- Auto-scaling configurations (HPA)

## Next Steps

1. Complete remaining agents (2-6)
2. Implement central analytics API
3. Add comprehensive test suites
4. Set up monitoring dashboards
5. Implement API gateway
6. Add authentication/authorization layer

## Contributing

When adding a new agent:
1. Follow the structure of calendar-agent
2. Include Dockerfile, docker-compose.yml, and k8s-deployment.yaml
3. Add comprehensive README
4. Include .env.example with all required variables
5. Update this main README

## License

[Your License Here]
