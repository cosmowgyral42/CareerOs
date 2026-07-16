from fastapi import FastAPI


app = FastAPI(
    title="CareerOS API",
    description="Backend API for the CareerOS platform",
    version="1.0.0",
)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "CareerOS API is running"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy"
    }