from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
from Utils import validateNodeVal

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis server
redis_client = redis.StrictRedis(host='192.168.64.7', port=6379, db=0, charset="utf-8", decode_responses=True)


def getUniqueMinionIds():
    minion_ids = set()
    keys = redis_client.keys()
    for key in keys:
        data = redis_client.get(key)
        if data:
            formatted_data = json.loads(data)
            minion_id = formatted_data.get("id")
            if minion_id:
                minion_ids.add(minion_id)
    return minion_ids


@app.get("/getMinions", response_model=set)
def getUniqueMinionIdsList():
    return getUniqueMinionIds()


@app.get("/events")
def getAllKeys(node: str = "", val: Union[str, bool, int] = ""):
    # Get all keys from Redis
    node_val = validateNodeVal(node, val)
    keys = redis_client.keys()
    result = {}
    for key in keys:
        data = redis_client.get(key)
        if data:
            formatted_data = json.loads(data)
            if node and node in formatted_data:
                if node == 'fun_args':
                    if node_val in formatted_data[node]:
                        result[key] = formatted_data
                if formatted_data[node] == node_val:
                    result[key] = formatted_data
            else:
                result[key] = formatted_data
    return result


@app.get("/events/{jobId}")
def getDataByJobId(jobId: str, node: str = ""):
    # Retrieve data from Redis based on the job ID
    data = redis_client.get(jobId)

    if data is None:
        raise HTTPException(status_code=404, detail="Job ID not found")

    try:
        formatted_data = json.loads(data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON data")

    if node:
        if node in formatted_data:
            data = formatted_data[node]
        else:
            raise HTTPException(status_code=404, detail=f"Node '{node}' not found in job data")
    else:
        data = formatted_data

    return {"jobId": jobId, "data": data}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

