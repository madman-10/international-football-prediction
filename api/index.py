from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import prediction

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up server...")

    # Call the function to load the pipelines.
    prediction.load_pipelines()
    print("Models loaded. Ready for traffic!")
    yield
    # Anything after 'yield' happens when you shut the server down
    print("Shutting down server...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can restrict this to your Vercel URL later)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)
class Matches(BaseModel):
    home_team : str
    away_team : str
    tournament : str

@app.post("/api/predict")
def make_prediction(request : Matches):
    # Pass the validated Pydantic fields to your ML service
    result = prediction.predict_match(
        home_team=request.home_team, 
        away_team=request.away_team, 
        tournament=request.tournament
    )

    return result