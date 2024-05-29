from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import (
    ElectionViewSet,
    CandidateViewSet,
    VoteViewSet,
    CloseElectionView,
    get_public_key,
    ElectionCandidatesView,
)

router = DefaultRouter()
router.register(r"elections", ElectionViewSet)
router.register(r"candidates", CandidateViewSet)
router.register(r"votes", VoteViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "close-election/<int:election_id>/",
        CloseElectionView.as_view(),
        name="close-election",
    ),
    path(
        "elections/<int:election_id>/candidates/",
        ElectionCandidatesView.as_view(),
        name="election-candidates",
    ),
    path("get-public-key/", get_public_key, name="get-public-key"),
]
