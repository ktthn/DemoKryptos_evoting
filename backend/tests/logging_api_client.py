from rest_framework.test import APIClient
import logging

logger = logging.getLogger(__name__)


class LoggingAPIClient(APIClient):
    def _log_request(self, path, data, method):
        logger.debug(f"Request Path: {path}")
        logger.debug(f"Request Method: {method}")
        logger.debug(f"Request Body: {data}")

    def post(
        self, path, data=None, format=None, content_type=None, follow=False, **extra
    ):
        self._log_request(path, data, "POST")
        return super().post(path, data, format, content_type, follow, **extra)

    def get(self, path, data=None, follow=False, **extra):
        self._log_request(path, data, "GET")
        return super().get(path, data, follow, **extra)
