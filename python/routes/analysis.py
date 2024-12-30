from fastapi import APIRouter
from routes.summary import router as summary_router
from routes.cluster import router as cluster_router
from routes.predicted import router as predicted_router

router = APIRouter()

# Menyertakan semua router
router.include_router(summary_router, prefix="/summary", tags=["summary"])
router.include_router(cluster_router, prefix="/cluster", tags=["cluster"])
router.include_router(predicted_router, prefix="/predicted", tags=["predicted"])