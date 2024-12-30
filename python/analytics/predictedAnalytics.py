import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error

def predict_randomforest_dht22(data, target_column):
    """
    Fungsi untuk melakukan prediksi dengan Random Forest pada data DHT22.
    
    Parameters:
        data (list): Data input dalam format list of dicts.
        target_column (str): Kolom target yang akan diprediksi.

    Returns:
        dict: Hasil prediksi dan evaluasi model.
    """
    try:
        # Konversi data ke DataFrame
        df = pd.DataFrame(data)



        # Validasi kolom target
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in data.")

        # Pisahkan fitur dan target
        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Split data menjadi train dan test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Inisialisasi model Random Forest
        model = RandomForestRegressor(random_state=42)

        # Latih model
        model.fit(X_train, y_train)

        # Prediksi pada data test
        predictions = model.predict(X_test)

        # Evaluasi model
        mse = mean_squared_error(y_test, predictions)

        return {
            "status": "success",
            "mean_squared_error": mse,
            "predictions": predictions.tolist(),
        }
    except Exception as e:
        raise ValueError(f"Error in predict_randomforest_dht22: {e}")


def predict_randomforest_ldr(data, target_column="ldr_value"):
    """
    Fungsi untuk melakukan prediksi dengan Random Forest pada data LDR.
    
    Parameters:
        data (list): Data input dalam format list of dicts.
        target_column (str): Kolom target yang akan diprediksi.

    Returns:
        dict: Hasil prediksi dan evaluasi model.
    """
    try:
        # Konversi data ke DataFrame
        df = pd.DataFrame(data)

        # Validasi kolom target
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in data.")

        # Pisahkan fitur dan target
        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Split data menjadi train dan test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Inisialisasi model Random Forest
        model = RandomForestRegressor(random_state=42)

        # Latih model
        model.fit(X_train, y_train)

        # Prediksi pada data test
        predictions = model.predict(X_test)

        # Evaluasi model
        mse = mean_squared_error(y_test, predictions)

        return {
            "status": "success",
            "mean_squared_error": mse,
            "predictions": predictions.tolist(),
        }
    except Exception as e:
        raise ValueError(f"Error in predict_randomforest_ldr: {e}")


def predict_randomforest_ec(data, target_column="ec_value"):
    """
    Fungsi untuk melakukan prediksi dengan Random Forest pada data EC.
    
    Parameters:
        data (list): Data input dalam format list of dicts.
        target_column (str): Kolom target yang akan diprediksi.

    Returns:
        dict: Hasil prediksi dan evaluasi model.
    """
    try:
        # Konversi data ke DataFrame
        df = pd.DataFrame(data)

        # Validasi kolom target
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in data.")

        # Pisahkan fitur dan target
        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Split data menjadi train dan test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Inisialisasi model Random Forest
        model = RandomForestRegressor(random_state=42)

        # Latih model
        model.fit(X_train, y_train)

        # Prediksi pada data test
        predictions = model.predict(X_test)

        # Evaluasi model
        mse = mean_squared_error(y_test, predictions)

        return {
            "status": "success",
            "mean_squared_error": mse,
            "predictions": predictions.tolist(),
        }
    except Exception as e:
        raise ValueError(f"Error in predict_randomforest_ec: {e}")

