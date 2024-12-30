#routes/cluster.py
from fastapi import APIRouter, HTTPException
from fetchingData.fetch import fetch_sensor_data_cluster_dht22
from fetchingData.fetch import fetch_sensor_data_cluster_ec
from fetchingData.fetch import fetch_sensor_data_cluster_ldr
from analytics.predictedAnalytics import predict_randomforest_dht22
from analytics.predictedAnalytics import predict_randomforest_ldr
from analytics.predictedAnalytics import predict_randomforest_ec
router = APIRouter()

@router.get("/predict-dht22")
async def get_predict_randomforest_dht22():
    """
    Endpoint untuk prediksi data DHT22 menggunakan Random Forest.
    """
    try:
        data = await fetch_sensor_data_cluster_dht22()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
                

        predictions = predict_randomforest_dht22(data, target_column=["temp", "humid"])
        return {"status": "success", "predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/predict-ldr")
async def get_predict_randomforest_ldr():
    """
    Endpoint untuk prediksi data DHT22 menggunakan Random Forest.
    """
    try:
        data = await fetch_sensor_data_cluster_ldr()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")

        predictions = predict_randomforest_ldr(data, target_column="temp")
        return {"status": "success", "predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/predict-ec")
async def get_predict_randomforest_ldr():
    """
    Endpoint untuk prediksi data DHT22 menggunakan Random Forest.
    """
    try:
        data = await fetch_sensor_data_cluster_ec()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")

        predictions = predict_randomforest_ec(data, target_column="temp")
        return {"status": "success", "predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
