import os
import sys
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from supabase import create_client, Client

# Add backend directory to sys.path to support imports when running from root
sys.path.append(str(Path(__file__).parent))

from utils.ai_helper import analyze_ticket_ai

# Load env variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment.")

supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI(title="Datastraw CRM Support Backend", version="2.0")

# Resolve paths
BASE_DIR = Path(__file__).resolve().parent.parent  # project root
DIST_DIR = BASE_DIR / "frontend" / "dist"

# Setup CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for inputs
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    priority: str = "Medium"

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

# 1. POST /api/tickets — Create a ticket
@app.post("/api/tickets", status_code=201)
def create_ticket(ticket: TicketCreate):
    try:
        # Generate next TKT-XXX reference serial ID
        res = supabase.table("tickets").select("ticket_id").execute()
        count_data = res.data or []
        
        next_num = 1
        if count_data:
            ticket_nums = []
            for t in count_data:
                parts = t.get("ticket_id", "").split("-")
                if len(parts) == 2 and parts[1].isdigit():
                    ticket_nums.append(int(parts[1]))
            if ticket_nums:
                next_num = max(ticket_nums) + 1
        
        new_ticket_id = f"TKT-{str(next_num).zfill(3)}"

        # Run AI Triage Tagger
        ai_result = analyze_ticket_ai(ticket.subject, ticket.description)

        # Insert record
        ticket_data = {
            "ticket_id": new_ticket_id,
            "customer_name": ticket.customer_name,
            "customer_email": ticket.customer_email,
            "subject": ticket.subject,
            "description": ticket.description,
            "priority": ticket.priority,
            "sentiment": ai_result["sentiment"],
            "category": ai_result["category"],
            "status": "Open"
        }
        
        insert_res = supabase.table("tickets").insert(ticket_data).execute()
        if not insert_res.data:
            raise HTTPException(status_code=500, detail="Failed to write ticket to database.")
        
        created_record = insert_res.data[0]
        return {
            "ticket_id": created_record["ticket_id"],
            "created_at": created_record["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 2. GET /api/tickets — List tickets with filters
@app.get("/api/tickets")
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Closed)"),
    search: Optional[str] = Query(None, description="Search term for fields")
):
    try:
        # Build query
        query = supabase.table("tickets").select("*")
        
        # Apply filters
        if status and status != "all":
            query = query.eq("status", status)
        
        # Search query logic
        if search:
            s_term = f"%{search}%"
            # Supabase ilike on any key field (case insensitive match)
            query = query.or_(
                f"ticket_id.ilike.{s_term},customer_name.ilike.{s_term},customer_email.ilike.{s_term},subject.ilike.{s_term},description.ilike.{s_term}"
            )

        # Order by created_at descending
        res = query.order("created_at", desc=True).execute()
        tickets_list = res.data or []

        # Return only the requested fields
        output = []
        for t in tickets_list:
            output.append({
                "ticket_id": t["ticket_id"],
                "customer_name": t["customer_name"],
                "subject": t["subject"],
                "status": t["status"],
                "created_at": t["created_at"],
                "priority": t["priority"],
                "sentiment": t["sentiment"],
                "category": t["category"]
            })
        return output
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 3. GET /api/tickets/{ticket_id} — Get ticket details and notes
@app.get("/api/tickets/{ticket_id}")
def get_ticket_details(ticket_id: str):
    try:
        # Fetch ticket details
        ticket_res = supabase.table("tickets").select("*").eq("ticket_id", ticket_id).execute()
        if not ticket_res.data:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found.")
        
        ticket_record = ticket_res.data[0]

        # Fetch linked notes
        notes_res = supabase.table("notes").select("*").eq("ticket_id", ticket_id).order("created_at", desc=False).execute()
        notes = notes_res.data or []

        # Construct payload
        return {
            "ticket_id": ticket_record["ticket_id"],
            "customer_name": ticket_record["customer_name"],
            "customer_email": ticket_record["customer_email"],
            "subject": ticket_record["subject"],
            "description": ticket_record["description"],
            "status": ticket_record["status"],
            "priority": ticket_record["priority"],
            "sentiment": ticket_record["sentiment"],
            "category": ticket_record["category"],
            "created_at": ticket_record["created_at"],
            "updated_at": ticket_record["updated_at"],
            "notes": notes
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))

# 4. PUT /api/tickets/{ticket_id} — Update status or append a note
@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, payload: TicketUpdate):
    try:
        # Check if ticket exists
        ticket_res = supabase.table("tickets").select("id").eq("ticket_id", ticket_id).execute()
        if not ticket_res.data:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found.")

        updated_at = datetime.utcnow().isoformat() + "Z"

        # Update status if provided
        if payload.status:
            update_res = supabase.table("tickets").update({
                "status": payload.status,
                "updated_at": updated_at
            }).eq("ticket_id", ticket_id).execute()
            if not update_res.data:
                raise HTTPException(status_code=500, detail="Failed to update ticket status.")

        # Insert new note if provided
        if payload.notes:
            note_data = {
                "ticket_id": ticket_id,
                "note_text": payload.notes
            }
            note_res = supabase.table("notes").insert(note_data).execute()
            if not note_res.data:
                raise HTTPException(status_code=500, detail="Failed to add internal note.")

        return {
            "success": True,
            "updated_at": updated_at
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))

# Mount static files and catch-all for frontend in production
if DIST_DIR.exists():
    # Mount assets folder
    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
    
    # Catch-all route for client-side routing
    @app.get("/{catchall:path}")
    async def serve_frontend(request: Request, catchall: str):
        if catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        index_path = DIST_DIR / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        raise HTTPException(status_code=404, detail="Index file not found")
else:
    # Fallback message if dist doesn't exist yet
    @app.get("/{catchall:path}")
    async def serve_fallback(request: Request, catchall: str):
        if catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        return {"message": "Datastraw CRM API is running. Frontend has not been built yet. Run 'npm run build' to generate frontend files."}

