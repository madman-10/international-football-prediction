import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier

# 1. Load your data
df = pd.read_csv(r'D:\\Projects\\WorldCup_Predictor\\datasets\\reduced_results_winners.csv')

features= ['home_team', 'away_team', 'tournament']
# Select features
X = df[features]
y = df['result']  # This holds 'home', 'away', 'draw'

# 2. Encode the target variable
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# 3. Train/Validation Split
# We MUST hold back some data (20%) so the model can test itself during training
X_train, X_val, y_train, y_val = train_test_split(X, y_encoded, test_size=0.2, random_state=42)


# 4. Create the Preprocessor (One-Hot Encoder)
# handle_unknown='ignore' ensures the model doesn't crash if it sees a brand new team later
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), features)
    ]
)

# Transform the data manually for training
X_train_encoded = preprocessor.fit_transform(X_train)
X_val_encoded = preprocessor.transform(X_val) # Use transform, NOT fit_transform for val

# 5. Define the XGBoost Model with Early Stopping
xgb_model = XGBClassifier(
    n_estimators=1500,         # Max "epochs" (number of trees)
    learning_rate=0.1,        # How much each tree contributes
    early_stopping_rounds=100,  # Stop if no improvement after specified trees
    eval_metric=['mlogloss', 'merror'],    # Metric to evaluate (Multi-class log loss) and error
    random_state=42
)

# 6. Train the model and display live results
print("Starting training...")
xgb_model.fit(
    X_train_encoded, 
    y_train,
    eval_set=[(X_train_encoded, y_train), (X_val_encoded, y_val)], # Show train vs val metrics
    verbose=100 # Print the results every specified "epochs"/trees
)
print(f"Training stopped. Best iteration: {xgb_model.best_iteration}")

# 7. Re-combine into a Pipeline for Easy Saving & Future Use
# Now that both are trained, put them back together so predictions only require 1 additional step
final_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', xgb_model)
])

# 8. Save the final pipeline and label encoder
joblib.dump(final_pipeline, 'world_cup_xgb_model.pkl')
joblib.dump(label_encoder, 'target_label_encoder.pkl')
print("Model with early stopping saved successfully!")