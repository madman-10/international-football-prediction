import joblib
import pandas as pd

# 1. Load the unified pipeline and encoder
loaded_pipeline = joblib.load('world_cup_xgb_model.pkl')
loaded_label_encoder = joblib.load('target_label_encoder.pkl')

def predict_match(home_team, away_team, tournament):
    # Pass the raw text just like before
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
    for cls, prob in zip(classes, probabilities):
        print(f"  - {cls}: {prob:.2%}")

# Example
predict_match('France', 'Spain', 'FIFA World Cup')