#!/usr/bin/env python3
"""IDOR / Ownership probe — generic, data-driven, read/write-safe.

WHY: The static endpoint-guard audit (rbac_endpoint_guard_audit.py) flags every
endpoint that has ONLY `current_user` (no require_perm) as a "data-leak risk".
But many of those are SAFE because they enforce ownership INSIDE the handler
(e.g. /api/hr/leaves/{leave_id} calls _assert_can_view_employee_leave). A static
scanner CANNOT tell the difference — only a LIVE cross-user probe can.

This script is the runtime companion: for each "authenticated-only" endpoint that
returns PII / financial / per-user data, it logs in as TWO different non-privileged
users and asserts that user-B CANNOT read user-A's object (expect 403/404), while
the OWNER (and SUPER_ADMIN) still can.

HOW TO EXTEND (next agent): copy an entry in CASES below. Two shapes:
  * "user_scoped"     — the resource id in the URL IS a user/employee id.
  * "resource_scoped" — create a resource as the owner, then probe by its id.
Run:  python /app/scripts/idor_ownership_probe.py
Exit code 0 = all ownership invariants hold; non-zero = a real IDOR leak.
"""
import json
import sys
import time
import urllib.error
import urllib.request

API = "http://localhost:8001"
PW = "Torado@2026"

# Two ordinary, NON-HR, NON-super users for cross-user tests + the super admin.
OWNER_EMAIL = "finance@torado.id"      # user A (the data owner)
OTHER_EMAIL = "executive@torado.id"    # user B (the attacker — must be blocked)
SUPER_EMAIL = "admin@torado.id"        # SUPER_ADMIN ('*') — must still pass

GREEN, RED, YEL, RST = "\033[92m", "\033[91m", "\033[93m", "\033[0m"


def login(email):
    body = json.dumps({"email": email, "password": PW}).encode()
    req = urllib.request.Request(API + "/api/auth/login", data=body,
                                 headers={"Content-Type": "application/json"})
    for _ in range(4):
        try:
            r = urllib.request.urlopen(req, timeout=15)
            d = json.loads(r.read())
            data = d.get("data") or d
            return data["access_token"], (data.get("user") or {})
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(7)
                continue
            raise
    raise RuntimeError("login failed (rate limit): " + email)


def call(method, path, token, body=None):
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(API + path, data=data, method=method, headers=headers)
    try:
        r = urllib.request.urlopen(req, timeout=15)
        return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


# --- CASES -----------------------------------------------------------------
# user_scoped : {kind, name, path} — path has "{id}" replaced by the target user id.
# resource_scoped: {kind, name, create:(method,path,body), id_field, get_path,
#                   cleanup:(method,path)} — create as owner, probe by resource id.
CASES = [
    {
        "kind": "user_scoped",
        "name": "GET /api/hr/leaves/summary/{employee_id}  (leave PII)",
        "path": "/api/hr/leaves/summary/{id}",
    },
    {
        "kind": "resource_scoped",
        "name": "GET /api/hr/leaves/{leave_id}  (leave detail PII)",
        "create": ("POST", "/api/hr/leaves",
                   {"leave_type": "annual", "start_date": "2026-09-01",
                    "end_date": "2026-09-02", "notes": "idor-probe"}),
        "id_field": "id",
        "get_path": "/api/hr/leaves/{id}",
        "cleanup": ("DELETE", "/api/hr/leaves/{id}"),
    },
    # --- ADD MORE HERE as you audit the 59 "authenticated-only" endpoints ---
    # Example template (user-scoped):
    # {"kind": "user_scoped",
    #  "name": "GET /api/<something>/{user_id}",
    #  "path": "/api/<something>/{id}"},
]


def verdict(label, ok, extra=""):
    tag = f"{GREEN}PASS{RST}" if ok else f"{RED}FAIL{RST}"
    print(f"  [{tag}] {label} {extra}")
    return 0 if ok else 1


def run():
    print("=" * 78)
    print("  IDOR / OWNERSHIP PROBE — live cross-user enforcement")
    print("=" * 78)
    owner_tok, owner = login(OWNER_EMAIL); time.sleep(1)
    other_tok, _ = login(OTHER_EMAIL); time.sleep(1)
    super_tok, _ = login(SUPER_EMAIL); time.sleep(1)
    owner_id = owner.get("id")
    print(f"  owner={OWNER_EMAIL} (id={owner_id})  other={OTHER_EMAIL}  super={SUPER_EMAIL}\n")

    fails = 0
    for c in CASES:
        print(f"• {c['name']}")
        if c["kind"] == "user_scoped":
            p_owner = c["path"].format(id=owner_id)
            co, _ = call("GET", p_owner, owner_tok)
            fails += verdict("owner reads OWN data", co != 403 and co < 500, f"(http {co})")
            cx, _ = call("GET", p_owner, other_tok)
            fails += verdict("other BLOCKED from owner's data", cx == 403, f"(http {cx} — expect 403)")
            cs, _ = call("GET", p_owner, super_tok)
            fails += verdict("super reads any data", cs != 403 and cs < 500, f"(http {cs})")
            cn, _ = call("GET", p_owner, None)
            fails += verdict("no-token blocked", cn == 401, f"(http {cn} — expect 401)")

        elif c["kind"] == "resource_scoped":
            m, p, b = c["create"]
            cc, raw = call(m, p, owner_tok, b)
            try:
                rid = (json.loads(raw).get("data") or {}).get(c["id_field"])
            except Exception:
                rid = None
            if not rid:
                fails += verdict("create resource as owner", False, f"(http {cc}, no id)")
                print()
                continue
            verdict("create resource as owner", True, f"(id={rid})")
            gp = c["get_path"].format(id=rid)
            co, _ = call("GET", gp, owner_tok)
            fails += verdict("owner reads OWN resource", co == 200, f"(http {co})")
            cx, _ = call("GET", gp, other_tok)
            fails += verdict("other BLOCKED from resource", cx == 403, f"(http {cx} — expect 403)")
            cs, _ = call("GET", gp, super_tok)
            fails += verdict("super reads resource", cs == 200, f"(http {cs})")
            cnf, _ = call("GET", c["get_path"].format(id="does-not-exist"), owner_tok)
            fails += verdict("non-existent -> 404", cnf == 404, f"(http {cnf})")
            if c.get("cleanup"):
                cm, cpath = c["cleanup"]
                call(cm, cpath.format(id=rid), owner_tok)
        print()

    print("=" * 78)
    status = f"{GREEN}✅ ALL OWNERSHIP INVARIANTS HOLD{RST}" if fails == 0 else f"{RED}❌ {fails} IDOR LEAK(S){RST}"
    print(f"  RESULT: {status}")
    print("=" * 78)
    return fails


if __name__ == "__main__":
    sys.exit(0 if run() == 0 else 1)
