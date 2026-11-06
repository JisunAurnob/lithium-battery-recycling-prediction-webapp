import joblib
import streamlit as st
import numpy as np

# ✅ Correct file path
model_path = "profit_m1.pkl"

# ✅ Load the trained model correctly
def load_model():
    try:
        regressor = joblib.load(model_path)
        
        # ✅ Check if the loaded model has a 'predict' method
        if not hasattr(regressor, 'predict'):
            st.error("❌ Error: The loaded model does not have a 'predict' method. Ensure it's a trained regression model.")
            return None
        return regressor

    except Exception as e:
        st.error(f"❌ Error loading model: {e}")
        return None

# ✅ Load the model at startup
regressor = load_model()

# ✅ Prediction Function
def predict(input_data):
    if regressor:
        input_data = np.array(input_data).reshape(1, -1)
        try:
            prediction = regressor.predict(input_data)
            return prediction[0]
        except Exception as e:
            st.error(f"❌ Prediction error: {e}")
            return None
    else:
        st.error("❌ Model is not loaded correctly.")
        return None

# ✅ Streamlit UI
def main():
    st.title("Lithium-ion Battery Profit Prediction")

    Year = st.number_input("Year", min_value=2000, max_value=2050, value=2024)
    Virgin_material_value = st.number_input("Virgin Material Value ($)", min_value=0.0, value=0.0)
    Cost_to_recycle = st.number_input("Cost to Recycle ($)", min_value=0.0, value=0.0)
    
    Type_Direct = st.selectbox("Direct Recycling", options=[0, 1], index=0)
    Type_Hydro = st.selectbox("Hydro Recycling", options=[0, 1], index=0)
    Type_Pyro = st.selectbox("Pyro Recycling", options=[0, 1], index=0)
    
    Cathode_LFP = st.selectbox("Cathode Scenario: LFP", options=[0, 1], index=0)
    Cathode_NCX = st.selectbox("Cathode Scenario: NCX", options=[0, 1], index=0)
    
    Location_China_truck_tanker = st.selectbox("Location Scenario: China - Truck & Tanker", options=[0, 1], index=0)
    Location_US_train = st.selectbox("Location Scenario: US - Train", options=[0, 1], index=0)
    Location_US_truck = st.selectbox("Location Scenario: US - Truck", options=[0, 1], index=0)
    
    Recycling_Location_China = st.selectbox("Recycling Location: China", options=[0, 1], index=0)
    Recycling_Location_US = st.selectbox("Recycling Location: U.S.", options=[0, 1], index=0)

    input_data = [
        Year, Virgin_material_value, Cost_to_recycle, Type_Direct, Type_Hydro, Type_Pyro,
        Cathode_LFP, Cathode_NCX, Location_China_truck_tanker,
        Location_US_train, Location_US_truck, Recycling_Location_China, Recycling_Location_US
    ]

    if st.button("Predict"):
        prediction = predict(input_data)
        if prediction is not None:
            st.success(f"Predicted Profit: ${round(prediction, 2)}")

if __name__ == '__main__':
    main()
