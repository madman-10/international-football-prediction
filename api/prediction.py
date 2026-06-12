import joblib
import pandas as pd

loaded_pipeline = None
loaded_label_encoder = None

# 1. Load the unified pipeline and encoder
def load_pipelines():
    global loaded_pipeline, loaded_label_encoder
    loaded_pipeline = joblib.load('world_cup_xgb_model.pkl')
    loaded_label_encoder = joblib.load('target_label_encoder.pkl')
    print("Loaded successfully!")

load_pipelines()

def predict_match(home_team, away_team, tournament):
    # Pass the raw text
    match_data = pd.DataFrame({
        'home_team': [home_team],
        'away_team': [away_team],
        'tournament' : [tournament],
    })
    
    # The pipeline automatically encodes the text and makes the prediction
    numeric_prediction = loaded_pipeline.predict(match_data)
    probabilities = loaded_pipeline.predict_proba(match_data)[0]
    
    # Decode the result
    final_result = loaded_label_encoder.inverse_transform(numeric_prediction)[0]
    classes = loaded_label_encoder.classes_
    
    if final_result == "away":
        team_display = away_team + " WIN"
    elif final_result == "home":
        team_display = home_team + " WIN"
    else:
        team_display = "DRAW"

    print(f"\nMatch: {home_team} (Home) vs {away_team} (Away)")
    print(f"Predicted Outcome: {team_display.upper()}")
    prob_dict = {}
    for cls, prob in zip(classes, probabilities):
        prob = float(prob)
        if cls == "away":
            result = away_team
            prob_dict[away_team] = prob
        elif cls == "home":
            result = home_team
            prob_dict[home_team] = prob
        else:
            result = "Draw"
            prob_dict["Draw"] = prob
        print(f"  - {result}: {prob:.2%}")
    
    return {
        "prediction" : team_display.upper(),
        "probabilities" : prob_dict
    }

# Example
# predict_match('Iceland', 'Argentina', 'Friendly')