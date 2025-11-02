from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI(title='AgroLink Analytics')

class Query(BaseModel):
    crop: str
    season: str
    region: str

# Simple mock training on startup
X = np.array([[1,1,1],[1,2,1],[2,1,1],[2,2,1],[1,1,2],[2,1,2]])
y = np.array([100,120,110,130,90,95])
model = LinearRegression().fit(X,y)

def encode(q: Query):
    # simple mock encoding
    crop_map = {'tomato':1,'wheat':2,'corn':3}
    season_map = {'rabi':1,'kharif':2,'zaid':3}
    region_map = {'north':1,'south':2,'east':3,'west':4}
    return np.array([[crop_map.get(q.crop.lower(),1), season_map.get(q.season.lower(),1), region_map.get(q.region.lower(),1)]])

@app.post('/predict')
def predict(q: Query):
    x = encode(q)
    pred = model.predict(x)[0]
    return { 'predictedPrice': float(pred), 'demandScore': float(pred / 100) }
