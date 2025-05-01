from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import process
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and normalize data
df = pd.read_csv(r'C:\Artist-Discovery-Engine\python-search\artists.csv', encoding='latin1')
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
artist_list = df["name"].dropna().unique().tolist()

@app.get("/search")
def search_artist(q: str = Query(...)):
    matches = process.extract(q, artist_list, limit=10)

    results = []
    for name, score, _ in matches:
        row = df[df["name"] == name].iloc[0]

        # Replace NaN with empty strings
        results.append({
            "name": row["name"],
            "genre": str(row.get("genre", "") or ""),
            "location": str(row.get("location", "") or ""),
            "profile_picture_url": str(row.get("profile_picture_url", "") or ""),
            "score": float(score)  # Ensure this is a valid float
        })

    return results

