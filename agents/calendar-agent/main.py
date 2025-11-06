"""
Calendar Agent - Workforce Wellbeing Analytics
Scrapes and summarizes work calendar patterns from Outlook / Google Calendar.
"""
import asyncio
import hashlib
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
import httpx
from celery import Celery
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Calendar Agent",
    description="Analyzes calendar patterns to detect workload and stress indicators",
    version="1.0.0"
)

# Initialize Celery for async tasks
celery_app = Celery(
    'calendar_agent',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

# Configuration
CENTRAL_API_URL = os.getenv('CENTRAL_API_URL', 'http://localhost:8000/api/features')
GOOGLE_CALENDAR_API = os.getenv('GOOGLE_CALENDAR_API', '')
OUTLOOK_CALENDAR_API = os.getenv('OUTLOOK_CALENDAR_API', '')
SCRAPING_INTERVAL = int(os.getenv('SCRAPING_INTERVAL_MINUTES', '60'))


# Pydantic Models
class CalendarEvent(BaseModel):
    """Individual calendar event"""
    event_id: str
    start_time: datetime
    end_time: datetime
    title: str
    attendees_count: int = 0
    is_recurring: bool = False


class CalendarFeatures(BaseModel):
    """Extracted features from calendar analysis"""
    employee_id: str = Field(..., description="Hashed employee identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    avg_meeting_hours_per_day: float
    back_to_back_meetings_count: int
    free_time_ratio: float
    after_hours_meeting_frequency: int
    meeting_load_trend: float
    total_meetings: int
    longest_meeting_block: float


class FeaturePayload(BaseModel):
    """Payload sent to central analytics API"""
    employee_id: str
    timestamp: datetime
    source: str = "calendar_agent"
    features: Dict[str, float]


# Utility Functions
def hash_employee_id(email: str) -> str:
    """Hash employee email to anonymize identity"""
    return hashlib.sha256(email.encode()).hexdigest()[:16]


def is_after_hours(event_time: datetime) -> bool:
    """Check if event is outside standard working hours (9 AM - 6 PM)"""
    hour = event_time.hour
    weekday = event_time.weekday()
    # Weekend or outside 9-18
    return weekday >= 5 or hour < 9 or hour >= 18


def calculate_free_time_ratio(events: List[CalendarEvent], work_hours: float = 8.0) -> float:
    """Calculate the ratio of free time between meetings"""
    if not events:
        return 1.0
    
    sorted_events = sorted(events, key=lambda x: x.start_time)
    total_meeting_time = sum(
        (event.end_time - event.start_time).total_seconds() / 3600
        for event in sorted_events
    )
    
    if total_meeting_time >= work_hours:
        return 0.0
    
    return (work_hours - total_meeting_time) / work_hours


def find_back_to_back_meetings(events: List[CalendarEvent]) -> int:
    """Count back-to-back meetings (< 15 min gap)"""
    if len(events) < 2:
        return 0
    
    sorted_events = sorted(events, key=lambda x: x.start_time)
    back_to_back_count = 0
    
    for i in range(len(sorted_events) - 1):
        gap = (sorted_events[i + 1].start_time - sorted_events[i].end_time).total_seconds() / 60
        if gap < 15:  # Less than 15 minutes between meetings
            back_to_back_count += 1
    
    return back_to_back_count


def calculate_longest_meeting_block(events: List[CalendarEvent]) -> float:
    """Calculate the longest continuous block of meetings in hours"""
    if not events:
        return 0.0
    
    sorted_events = sorted(events, key=lambda x: x.start_time)
    max_block = 0.0
    current_block_start = sorted_events[0].start_time
    current_block_end = sorted_events[0].end_time
    
    for i in range(1, len(sorted_events)):
        gap = (sorted_events[i].start_time - current_block_end).total_seconds() / 60
        
        if gap < 15:  # Continue the block
            current_block_end = max(current_block_end, sorted_events[i].end_time)
        else:  # New block
            block_duration = (current_block_end - current_block_start).total_seconds() / 3600
            max_block = max(max_block, block_duration)
            current_block_start = sorted_events[i].start_time
            current_block_end = sorted_events[i].end_time
    
    # Check final block
    block_duration = (current_block_end - current_block_start).total_seconds() / 3600
    max_block = max(max_block, block_duration)
    
    return round(max_block, 2)


async def fetch_google_calendar_events(
    employee_email: str,
    start_date: datetime,
    end_date: datetime
) -> List[CalendarEvent]:
    """Fetch calendar events from Google Calendar API"""
    # This is a placeholder - implement actual Google Calendar API integration
    logger.info(f"Fetching Google Calendar events for {employee_email}")
    
    # TODO: Implement actual Google Calendar API call with OAuth
    # For now, returning empty list
    return []


async def fetch_outlook_calendar_events(
    employee_email: str,
    start_date: datetime,
    end_date: datetime
) -> List[CalendarEvent]:
    """Fetch calendar events from Outlook Calendar API"""
    # This is a placeholder - implement actual Outlook Calendar API integration
    logger.info(f"Fetching Outlook Calendar events for {employee_email}")
    
    # TODO: Implement actual Outlook Calendar API call with OAuth
    # For now, returning empty list
    return []


def analyze_calendar_events(events: List[CalendarEvent], employee_email: str) -> CalendarFeatures:
    """Analyze calendar events and extract wellbeing features"""
    if not events:
        return CalendarFeatures(
            employee_id=hash_employee_id(employee_email),
            avg_meeting_hours_per_day=0.0,
            back_to_back_meetings_count=0,
            free_time_ratio=1.0,
            after_hours_meeting_frequency=0,
            meeting_load_trend=0.0,
            total_meetings=0,
            longest_meeting_block=0.0
        )
    
    # Calculate metrics
    total_meeting_hours = sum(
        (event.end_time - event.start_time).total_seconds() / 3600
        for event in events
    )
    
    # Calculate days span
    sorted_events = sorted(events, key=lambda x: x.start_time)
    days_span = (sorted_events[-1].start_time - sorted_events[0].start_time).days + 1
    days_span = max(days_span, 1)
    
    avg_meeting_hours = total_meeting_hours / days_span
    back_to_back_count = find_back_to_back_meetings(events)
    free_time_ratio = calculate_free_time_ratio(events)
    after_hours_count = sum(1 for event in events if is_after_hours(event.start_time))
    longest_block = calculate_longest_meeting_block(events)
    
    # Meeting load trend (simplified - compare first half vs second half)
    mid_point = len(events) // 2
    first_half_avg = sum(
        (event.end_time - event.start_time).total_seconds() / 3600
        for event in sorted_events[:mid_point]
    ) / max(mid_point, 1)
    
    second_half_avg = sum(
        (event.end_time - event.start_time).total_seconds() / 3600
        for event in sorted_events[mid_point:]
    ) / max(len(sorted_events) - mid_point, 1)
    
    meeting_load_trend = ((second_half_avg - first_half_avg) / max(first_half_avg, 0.1)) * 100
    
    return CalendarFeatures(
        employee_id=hash_employee_id(employee_email),
        avg_meeting_hours_per_day=round(avg_meeting_hours, 2),
        back_to_back_meetings_count=back_to_back_count,
        free_time_ratio=round(free_time_ratio, 2),
        after_hours_meeting_frequency=after_hours_count,
        meeting_load_trend=round(meeting_load_trend, 2),
        total_meetings=len(events),
        longest_meeting_block=longest_block
    )


async def send_features_to_central_api(features: CalendarFeatures):
    """Send extracted features to central analytics API"""
    payload = FeaturePayload(
        employee_id=features.employee_id,
        timestamp=features.timestamp,
        features={
            "avg_meeting_hours_per_day": features.avg_meeting_hours_per_day,
            "back_to_back_meetings_count": float(features.back_to_back_meetings_count),
            "free_time_ratio": features.free_time_ratio,
            "after_hours_meeting_frequency": float(features.after_hours_meeting_frequency),
            "meeting_load_trend": features.meeting_load_trend,
            "total_meetings": float(features.total_meetings),
            "longest_meeting_block": features.longest_meeting_block
        }
    )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                CENTRAL_API_URL,
                json=payload.model_dump(mode='json'),
                timeout=10.0
            )
            response.raise_for_status()
            logger.info(f"Successfully sent features for employee {features.employee_id}")
    except Exception as e:
        logger.error(f"Failed to send features to central API: {e}")
        raise


# Celery Tasks
@celery_app.task
def scrape_calendar_task(employee_email: str, calendar_provider: str = "google"):
    """Celery task to scrape calendar data periodically"""
    asyncio.run(scrape_and_analyze_calendar(employee_email, calendar_provider))


async def scrape_and_analyze_calendar(employee_email: str, calendar_provider: str = "google"):
    """Main function to scrape and analyze calendar"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)  # Analyze last 7 days
    
    logger.info(f"Scraping calendar for {employee_email} from {start_date} to {end_date}")
    
    # Fetch events based on provider
    if calendar_provider == "google":
        events = await fetch_google_calendar_events(employee_email, start_date, end_date)
    elif calendar_provider == "outlook":
        events = await fetch_outlook_calendar_events(employee_email, start_date, end_date)
    else:
        raise ValueError(f"Unsupported calendar provider: {calendar_provider}")
    
    # Analyze events
    features = analyze_calendar_events(events, employee_email)
    
    # Send to central API
    await send_features_to_central_api(features)
    
    return features


# FastAPI Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Calendar Agent",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "central_api": CENTRAL_API_URL
    }


@app.post("/analyze")
async def analyze_calendar(
    employee_email: str,
    calendar_provider: str = "google",
    days_back: int = 7
):
    """
    Manually trigger calendar analysis for an employee
    """
    try:
        features = await scrape_and_analyze_calendar(employee_email, calendar_provider)
        return {
            "status": "success",
            "features": features.model_dump()
        }
    except Exception as e:
        logger.error(f"Error analyzing calendar: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/schedule-scraping")
async def schedule_periodic_scraping(
    employee_emails: List[str],
    calendar_provider: str = "google",
    interval_minutes: int = 60
):
    """
    Schedule periodic scraping for multiple employees
    """
    scheduled_tasks = []
    
    for email in employee_emails:
        task = scrape_calendar_task.apply_async(
            args=[email, calendar_provider],
            countdown=interval_minutes * 60
        )
        scheduled_tasks.append({
            "employee_email": hash_employee_id(email),
            "task_id": task.id
        })
    
    return {
        "status": "scheduled",
        "tasks": scheduled_tasks,
        "interval_minutes": interval_minutes
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
