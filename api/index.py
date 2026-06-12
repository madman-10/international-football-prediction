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

origins = ["*"] # Add in the link to the frontend here. This/these will be the links allowed to access the Fast backend

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers= ["*"],
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