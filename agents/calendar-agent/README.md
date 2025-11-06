# Calendar Agent

The Calendar Agent is a microservice that analyzes work calendar patterns to detect workload and stress indicators for workforce wellbeing analytics.

## Features

### Extracted Metrics
- **Average Meeting Hours Per Day**: Daily meeting load
- **Back-to-Back Meetings**: Count of meetings with less than 15 minutes gap
- **Free Time Ratio**: Proportion of working hours without meetings
- **After-Hours Meetings**: Meetings outside standard working hours (9 AM - 6 PM)
- **Meeting Load Trend**: Week-over-week change in meeting hours
- **Longest Meeting Block**: Maximum continuous meeting duration

### Supported Calendar Providers
- Google Calendar (OAuth2)
- Microsoft Outlook / Office 365 (Microsoft Graph API)

## Architecture

```
┌─────────────────┐
│  Calendar APIs  │
│ (Google/Outlook)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────┐
│  FastAPI Server │────▶│    Redis    │
│   (Port 8001)   │     │  (Message   │
└────────┬────────┘     │   Broker)   │
         │              └──────┬──────┘
         │                     │
         ▼                     ▼
┌─────────────────┐     ┌─────────────┐
│ Feature         │     │   Celery    │
│ Extraction      │◀────│   Workers   │
└────────┬────────┘     └─────────────┘
         │
         ▼
┌─────────────────┐
│  Central API    │
│  (Analytics)    │
└─────────────────┘
```

## Setup

### Prerequisites
- Python 3.11+
- Redis
- Docker (optional)
- Kubernetes cluster (for production deployment)

### Local Development

1. **Install dependencies**:
```bash
cd agents/calendar-agent
pip install -r requirements.txt
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your API credentials
```

3. **Start Redis**:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or using Homebrew (macOS)
brew services start redis
```

4. **Run the service**:
```bash
# Start the API server
python main.py

# In separate terminals, start Celery workers
celery -A main.celery_app worker --loglevel=info
celery -A main.celery_app beat --loglevel=info
```

### Using Docker Compose

```bash
cd agents/calendar-agent
docker-compose up -d
```

This will start:
- Calendar Agent API (port 8001)
- Celery Worker
- Celery Beat Scheduler
- Redis

### Kubernetes Deployment

1. **Build and push Docker image**:
```bash
docker build -t your-registry/calendar-agent:latest .
docker push your-registry/calendar-agent:latest
```

2. **Update image in k8s-deployment.yaml**:
```yaml
image: your-registry/calendar-agent:latest
```

3. **Create secrets**:
```bash
kubectl create secret generic calendar-agent-secrets \
  --from-literal=GOOGLE_CLIENT_ID=your-id \
  --from-literal=GOOGLE_CLIENT_SECRET=your-secret \
  --from-literal=MICROSOFT_CLIENT_ID=your-id \
  --from-literal=MICROSOFT_CLIENT_SECRET=your-secret \
  -n wellbeing-analytics
```

4. **Deploy to Kubernetes**:
```bash
kubectl apply -f k8s-deployment.yaml
```

5. **Verify deployment**:
```bash
kubectl get pods -n wellbeing-analytics
kubectl logs -f deployment/calendar-agent -n wellbeing-analytics
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Manual Analysis
```bash
POST /analyze
{
  "employee_email": "user@example.com",
  "calendar_provider": "google",
  "days_back": 7
}
```

### Schedule Periodic Scraping
```bash
POST /schedule-scraping
{
  "employee_emails": ["user1@example.com", "user2@example.com"],
  "calendar_provider": "google",
  "interval_minutes": 60
}
```

## Configuration

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `CENTRAL_API_URL` | Central analytics API endpoint | `http://localhost:8000/api/features` |
| `CELERY_BROKER_URL` | Redis URL for Celery | `redis://localhost:6379/0` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `MICROSOFT_CLIENT_ID` | Microsoft Graph client ID | - |
| `SCRAPING_INTERVAL_MINUTES` | Default scraping interval | `60` |
| `WORK_START_HOUR` | Working hours start | `9` |
| `WORK_END_HOUR` | Working hours end | `18` |

## Privacy & Security

- All employee identifiers are hashed using SHA-256
- Only metadata is collected (no meeting content)
- OAuth2 authentication for calendar APIs
- All data anonymized at source
- Consent-based integration required

## Monitoring

The service includes:
- Health check endpoints
- Prometheus-compatible metrics (TODO)
- Structured logging
- Kubernetes liveness/readiness probes

## Testing

```bash
# Run tests (TODO: Add test suite)
pytest tests/

# Manual API testing
curl http://localhost:8001/health
```

## Next Steps

1. Implement OAuth2 flows for Google Calendar and Outlook
2. Add comprehensive test suite
3. Implement Prometheus metrics
4. Add rate limiting and retry logic
5. Create monitoring dashboards
6. Document API with OpenAPI/Swagger enhancements

## License

[Your License Here]
