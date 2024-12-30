from fastapi import APIRouter, HTTPException
from fetchingData.fetch import fetch_sensor_data_dht22
from analytics.summaryAnalytics import calculate_summary

router = APIRouter()

@router.get("/summary")
async def get_summary():
    """
    Endpoint untuk mendapatkan ringkasan data sensor (max, min, avg).
    """
    try:
        # Ambil data dari API fetchingData
        #fetching data dari folder fetchingData
        data = await fetch_sensor_data_dht22()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        
        # Analisis data
        #meggunkana method di analytics folder
        summary = calculate_summary(data)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
