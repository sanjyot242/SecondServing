# SecondServing
 connecting food donors with local shelters 


## For starting backend
Create a virtual envioronment 
`python -m venv .venv`

Create a .env file which has the DB details and the secret key for encryption with following keys
`DB_USER="postgres"
DB_PASSWORD=""
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="second-serving"
SECRET_KEY=""`

Install all the dependencies
`pip install -r requirements.txt`

Start the server
`uvicorn main:app --reload --port 8080`

All the database operations will be in crud.py
All the endpoints will be in routes.py
All the pydantic models will be in models.py
All the schemas for tables will be in schema.py
