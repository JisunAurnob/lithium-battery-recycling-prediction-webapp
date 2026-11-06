import streamlit as st
import pickle
import numpy as np

# Load the pre-trained model
model = pickle.load(open('circularity_model.pkl', 'rb'))

# Streamlit page title
st.title('Lithium-ion Battery Circularity Prediction')

# Create input fields for the user to enter values
year = st.number_input('Year', min_value=2020, max_value=2100, value=2020, step=1)
scenario_percent_repurposed = st.number_input('scenario.percent.repurposed', min_value=0.0, max_value=100.0, value=0.0)
scenario_reuse_lifespan = st.number_input('scenario.reuse.lifespan', min_value=0.0, max_value=100.0, value=0.0)
material = st.selectbox('material', ['Material1', 'Material2', 'Material3'])  # Replace with actual material options
kWh_retired = st.number_input('kWh.retired', min_value=0.0, max_value=10000000.0, value=0.0)
kg_retired = st.number_input('kg.retired', min_value=0.0, max_value=10000000.0, value=0.0)
kg_recycled_weight = st.number_input('kg.recycled.weight', min_value=0.0, max_value=10000000.0, value=0.0)
kWh = st.number_input('kWh', min_value=0.0, max_value=10000000.0, value=0.0)
kg_demand = st.number_input('kg.demand', min_value=0.0, max_value=10000000.0, value=0.0)
collection_rate = st.number_input('collection_rate', min_value=0.0, max_value=1.0, value=0.6)
recycling_process_direct = st.number_input('recycling.process_direct', min_value=0, max_value=1, value=1)
recycling_process_hydro = st.number_input('recycling.process_hydro', min_value=0, max_value=1, value=0)
recycling_process_pyro = st.number_input('recycling.process_pyro', min_value=0, max_value=1, value=0)
sales_scenario_sds = st.number_input('Sales.Scenario_SDS', min_value=0, max_value=1, value=1)
sales_scenario_steps = st.number_input('Sales.Scenario_STEPS', min_value=0, max_value=1, value=0)
cathode_scenario_lfp = st.number_input('Cathode.Scenario_LFP', min_value=0, max_value=1, value=1)
cathode_scenario_ncx = st.number_input('Cathode.Scenario_NCX', min_value=0, max_value=1, value=0)

# Prepare the input data for prediction
input_data = np.array([[
    year, scenario_percent_repurposed, scenario_reuse_lifespan, material, kWh_retired, kg_retired,
    kg_recycled_weight, kWh, kg_demand, collection_rate, recycling_process_direct, recycling_process_hydro,
    recycling_process_pyro, sales_scenario_sds, sales_scenario_steps, cathode_scenario_lfp, cathode_scenario_ncx
]])

# Predict the circularity using the model
if st.button('Predict Circularity'):
    prediction = model.predict(input_data)
    st.write(f'Predicted Circularity: {prediction[0]:.4f}')
