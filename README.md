# International Football Prediction ⚽️🏆

**NOTE :  The readme has been generated using AI**
[![GitHub issues](https://img.shields.io/github/issues/madman-10/international-football-prediction)](https://github.com/madman-10/international-football-prediction/issues)
[![GitHub forks](https://img.shields.io/github/forks/madman-10/international-football-prediction)](https://github.com/madman-10/international-football-prediction/network)
[![GitHub stars](https://img.shields.io/github/stars/madman-10/international-football-prediction)](https://github.com/madman-10/international-football-prediction/stargazers)

A machine learning and data analysis project to predict the outcomes of international football (soccer) matches. This project analyzes historical match data and team statistics to forecast match results (Win/Loss/Draw) or scorelines.

## 🚀 Features

*   **Data Processing:** Cleans and processes historical international football data (e.g., friendlies, World Cup, Euro, Copa America).
*   **Feature Engineering:** Calculates team form, head-to-head statistics, win streaks.
*   **Predictive Modeling:** Uses XGBoost to predict match outcomes.
*   **Evaluation Metrics:** Tracks model accuracy, precision.

## 🛠️ Tech Stack

*   **Language:** Python 3.x
*   **Data Manipulation:** Pandas, NumPy
*   **Machine Learning:** Scikit-Learn, XGBoost

## 📂 Project Structure

```text
international-football-prediction/
│
├─ train_model.py                    # Model training script
├── api/                             # Python scripts and model files
│   ├── index.py                     # Fastapi code for the prediction api
│   ├── prediction.py                # Predict function and output cleanup for frontend
│   ├── target_label_encoder.py      # Saved labels for win, draw loss after Label encoding
│   └── world_cup_xgb_model.py       # Saved xgboost model after training
├── datasets/                        # Raw and processed datasets
├── public/                
│   ├── teams.txt                    # List of teams for prediction
├── requirements.txt                 # Python dependencies
└── README.md                        # Project documentation
