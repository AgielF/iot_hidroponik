import numpy as np

def calculate_summary(data):
    """
    Menganalisis data sensor dan menghitung statistik dasar.
    
    Parameters:
        data (list): Daftar data sensor (list of dict).
    
    Returns:
        dict: Ringkasan statistik (max, min, avg).
    """
    temperatures = [item["temp"] for item in data]
    humidities = [item["humid"] for item in data]

    return {
        "temperature": {
            "max": int(np.max(temperatures)),
            "min": int(np.min(temperatures)),
            "avg": float(np.mean(temperatures)),
        },
        "humidity": {
            "max": int(np.max(humidities)),
            "min": int(np.min(humidities)),
            "avg": float(np.mean(humidities)),
        },
    }
