import requests
import json

url = "http://localhost:8000/predict"

test_cases = [
    {
        "name": "Edge Case (Minimum Valid Boundaries)",
        "payload": {
            "brand": "string",
            "model": "string",
            "yom": 1901,
            "engine_cc": 1,
            "gear": "string",
            "fuel_type": "string",
            "millage_km": 1
        }
    },
    {
        "name": "Invalid Boundary (YOM = 1900) - Should trigger validation error",
        "payload": {
            "brand": "Toyota",
            "model": "Vitz",
            "yom": 1900,
            "engine_cc": 1000,
            "gear": "Automatic",
            "fuel_type": "Petrol",
            "millage_km": 45000
        }
    },
    {
        "name": "Invalid Boundary (Engine CC = 0) - Should trigger validation error",
        "payload": {
            "brand": "Toyota",
            "model": "Vitz",
            "yom": 2018,
            "engine_cc": 0,
            "gear": "Automatic",
            "fuel_type": "Petrol",
            "millage_km": 45000
        }
    },
    {
        "name": "Invalid Boundary (Millage = 0) - Should trigger validation error",
        "payload": {
            "brand": "Toyota",
            "model": "Vitz",
            "yom": 2018,
            "engine_cc": 1000,
            "gear": "Automatic",
            "fuel_type": "Petrol",
            "millage_km": 0
        }
    }
]

print(f"Testing {len(test_cases)} boundary/edge test cases...\n" + "-"*60)

for i, test in enumerate(test_cases, 1):
    print(f"Test Case {i}: {test['name']}")
    print(f"Payload: {json.dumps(test['payload'])}")
    try:
        response = requests.post(url, json=test['payload'])
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status 200 OK | Output: {result}")
        elif response.status_code == 422:
            print(f"⚠️ Validation Error (422) as expected:\n{json.dumps(response.json()['detail'], indent=2)}")
        else:
            print(f"❌ Status {response.status_code} | Output: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
    print("-" * 60)
