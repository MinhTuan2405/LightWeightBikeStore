from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from dotenv import load_dotenv
import os
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# abstract class for models
Base = declarative_base()

# using to init a session to current database
def database():
    db = Session()
    try:
        yield db
    finally:
        db.close()



if __name__ == "__main__":
    from sqlalchemy import text
    db = Session()
    try:
        result = db.execute(text("SELECT version();"))
        version = result.fetchone()
        print("Connect database successfully!")
        print("🔹 PostgreSQL version:", version[0])
    except Exception as e:
        print("Error while connecting to database:", e)
    finally:
        db.close()
