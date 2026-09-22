# 20 — Privacy

## Overview

DataSage collects and processes user personal information. This document defines data classification, PII handling, retention policies, and compliance considerations for Indian data protection laws.

---

## Data Classification

| Classification | Definition | Examples | Handling |
|---------------|-----------|----------|----------|
| **Public** | Non-sensitive, freely available | Property listings, locality names, POI data | No restrictions |
| **Internal** | Business data, not user-specific | ML model weights, scoring parameters, system config | Access restricted to authorized personnel |
| **Confidential (PII)** | User personally identifiable information | Name, email, password hash, search history, preferences | Encrypted at rest, access-logged, retention-limited |
| **Restricted** | Highly sensitive credentials | JWT secrets, database passwords, API keys | Environment variables only, never logged, never in code |

---

## PII Inventory

| Data Element | Classification | Storage Location | Retention | Collected For |
|-------------|---------------|-----------------|-----------|---------------|
| Name | Confidential | `user.name` | Account lifetime + 30 days | Display, personalization |
| Email | Confidential | `user.email` | Account lifetime + 30 days | Authentication, communication |
| Password hash | Confidential | `user.password_hash` | Account lifetime | Authentication |
| Budget range | Confidential | `user_preference.budget_*` | Account lifetime | Recommendations |
| Commute destination | Confidential | `user_preference.commute_destination` | Account lifetime | Commute scoring |
| Lifestyle priorities | Confidential | `user_preference.lifestyle_priorities` | Account lifetime | Recommendations |
| Search queries | Confidential | `search_history.query_params` | 90 days | Search history feature |
| Saved properties | Confidential | `saved_property` | Account lifetime | Saved properties feature |
| IP address | Confidential | `audit_log.ip_address` | 90 days | Security audit |
| Last login timestamp | Internal | `user.last_login_at` | Account lifetime | Admin monitoring |

---

## Data Retention Policy

| Data | Active Retention | Post-Deletion | Hard Deletion |
|------|-----------------|---------------|---------------|
| User account | While active | Soft-deleted for 30 days (recoverable) | After 30 days: anonymize PII (hash name, delete email) |
| Search history | 90 days | Auto-deleted after 90 days | Immediate hard delete |
| Saved properties | While account active | Deleted with account | With account hard deletion |
| Recommendations | 24 hours (refresh cycle) | Overwritten on refresh | Auto-cleaned |
| Audit logs | 1 year | Archived | After 2 years |
| Property data | While dataset active | Retained even if user is deleted | Admin-controlled |

### Account Deletion Flow

```python
async def deactivate_account(user_id: str):
    """Soft-delete: mark inactive, schedule PII anonymization."""
    user = await user_repo.get_by_id(user_id)
    user.is_active = False
    user.deleted_at = datetime.utcnow()
    await session.commit()
    # Schedule anonymization after 30-day grace period
    schedule_anonymization(user_id, delay_days=30)

async def anonymize_user(user_id: str):
    """Hard anonymization after grace period."""
    user = await user_repo.get_by_id(user_id)
    user.name = f"Deleted User {hash(user_id)[:8]}"
    user.email = f"deleted_{hash(user_id)[:12]}@anonymized.local"
    user.password_hash = ""
    # Delete preferences
    await preference_repo.delete_by_user(user_id)
    # Delete search history
    await search_history_repo.delete_by_user(user_id)
    # Delete saved properties
    await saved_property_repo.delete_by_user(user_id)
    await session.commit()
```

---

## Consent Management

### Registration Consent

During registration, users agree to:
1. **Terms of Service**: General platform usage terms
2. **Privacy Policy**: How data is collected, used, and shared

Consent is recorded with timestamp:

```sql
ALTER TABLE "user" ADD COLUMN tos_accepted_at TIMESTAMPTZ;
ALTER TABLE "user" ADD COLUMN privacy_accepted_at TIMESTAMPTZ;
```

### Data Processing Basis

Under India's Digital Personal Data Protection Act (DPDPA) 2023:

| Data | Lawful Basis | Notes |
|------|-------------|-------|
| Name, email | Consent (registration) | User provides voluntarily |
| Password hash | Contract performance | Required for authentication |
| Preferences | Consent | User provides voluntarily during onboarding |
| Search history | Legitimate interest | Required for search history feature; user can delete |
| Saved properties | Consent | User explicitly saves |
| IP address (audit) | Legitimate interest | Security purpose |

---

## Data Minimization

- Only collect data necessary for the stated purpose.
- Preferences are optional — the system degrades gracefully without them.
- Search history is limited to 90 days and can be cleared by the user.
- No tracking cookies or third-party analytics in the MVP.

---

## User Rights

Under DPDPA 2023 and general privacy best practices:

| Right | Implementation |
|-------|---------------|
| Right to access | `GET /auth/me` returns all personal data. Future: export endpoint. |
| Right to correction | `PATCH /auth/me` allows profile updates |
| Right to deletion | `DELETE /auth/me` triggers account deactivation → anonymization |
| Right to data portability | Future: `GET /auth/me/export` returns JSON of all user data |
| Right to withdraw consent | User can delete account, clear search history, remove preferences |

---

## Logging Redaction

PII is never logged in application logs:

```python
# Middleware redacts PII from log context
REDACTED_FIELDS = {"password", "email", "name", "access_token", "refresh_token"}

def redact_log_data(data: dict) -> dict:
    return {
        k: "***REDACTED***" if k in REDACTED_FIELDS else v
        for k, v in data.items()
    }
```

---

## Related Documents

- [11 — Auth & Authorization](11-authentication-authorization.md)
- [19 — Security](19-security.md)
- [22 — Observability](22-observability.md)
