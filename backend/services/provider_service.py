"""
RemitWise AI – Provider Service
Compatible with the current providers.json
"""

import logging
from typing import Any, Dict, List, Optional

from config import settings
from utils.file_loader import load_json_file

logger = logging.getLogger(__name__)


def _load_providers() -> List[Dict[str, Any]]:
    data = load_json_file(settings.PROVIDERS_FILE)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        return data.get("providers", [])

    return []


def list_providers(active_only: bool = True) -> List[Dict[str, Any]]:
    providers = _load_providers()

    if active_only:
        providers = [
            p for p in providers
            if p.get("active", True)
        ]

    return providers


def get_provider_by_id(provider_id: str) -> Optional[Dict[str, Any]]:
    providers = _load_providers()

    for provider in providers:
        if provider["provider_id"].lower() == provider_id.lower():
            return provider

    return None


def get_supported_corridors(
    from_country: Optional[str] = None,
    to_country: Optional[str] = None,
) -> List[Dict[str, Any]]:

    providers = list_providers()

    results = []

    for provider in providers:

        for corridor in provider.get("supported_corridors", []):

            try:
                sender, receiver = corridor.split("-")
            except ValueError:
                continue

            if from_country and sender.upper() != from_country.upper():
                continue

            if to_country and receiver.upper() != to_country.upper():
                continue

            results.append({
                "provider_id": provider["provider_id"],
                "provider_name": provider["provider_name"],
                "from": sender,
                "to": receiver,
            })

    return results


def get_payment_methods(provider_id: str):

    provider = get_provider_by_id(provider_id)

    if not provider:
        raise ValueError("Provider not found")

    return provider["payment_methods"]


def get_delivery_methods(provider_id: str):

    provider = get_provider_by_id(provider_id)

    if not provider:
        raise ValueError("Provider not found")

    return provider["payout_methods"]


def compare_providers(
    from_country: str,
    to_country: str,
):

    providers = list_providers()

    corridor = f"{from_country.upper()}-{to_country.upper()}"

    matches = []

    for provider in providers:

        if corridor not in provider["supported_corridors"]:
            continue

        matches.append({
            "provider_id": provider["provider_id"],
            "provider_name": provider["provider_name"],
            "website": provider["website"],
            "payment_methods": provider["payment_methods"],
            "payout_methods": provider["payout_methods"],
            "delivery_speed": provider["delivery_speed"],
            "fee_model": provider["fee_model"],
            "tracking_available": provider["tracking_available"],
        })

    return matches