#!/bin/bash
# =============================================================
# health-check.sh — QuizMaster produkcijski health check
# Upotreba: ./health-check.sh [frontend_url] [backend_url]
# Primjer:  ./health-check.sh https://frontend.run.app https://backend.run.app
# =============================================================

# ── Konfiguracija ─────────────────────────────────────────────

FRONTEND_URL="${1:-http://localhost:3000}"
BACKEND_URL="${2:-http://localhost:3001}"
MAX_RETRIES=5
RETRY_WAIT=5
LOG_FILE="./logs/health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ── Priprema log direktorija ───────────────────────────────────

mkdir -p ./logs

# ── Pomocna funkcija za logovanje ─────────────────────────────

log() {
  local level="$1"
  local msg="$2"
  local entry="[$TIMESTAMP] [$level] $msg"
  echo "$entry"
  echo "$entry" >> "$LOG_FILE"
}

# ── Provjera dostupnosti alata ────────────────────────────────

if ! command -v curl &> /dev/null; then
  log "ERROR" "curl nije instaliran. Instalirajte ga i pokušajte ponovo."
  exit 1
fi

# ── Glavna funkcija za provjeru URL-a ─────────────────────────
# Argumenti: $1 = URL, $2 = naziv servisa

check_url() {
  local url="$1"
  local name="$2"
  local retries=0

  log "INFO" "Provjera servisa '$name' na: $url"

  while [ "$retries" -lt "$MAX_RETRIES" ]; do

    # Pošalji HTTP request, uzmi samo status kod

    HTTP_STATUS=$(curl --silent --output /dev/null \
                       --write-out "%{http_code}" \
                       --connect-timeout 10 \
                       --max-time 15 \
                       "$url" 2>/dev/null)

    if [ "$HTTP_STATUS" -eq 200 ] 2>/dev/null; then
      log "OK" "$name je zdrav — HTTP $HTTP_STATUS"
      return 0
    fi

    retries=$((retries + 1))
    log "WARN" "$name pokušaj $retries/$MAX_RETRIES neuspješan (HTTP $HTTP_STATUS). Čekanje ${RETRY_WAIT}s..."
    sleep "$RETRY_WAIT"
  done

  log "ERROR" "$name nije dostupan nakon $MAX_RETRIES pokušaja. Posljednji status: HTTP $HTTP_STATUS"
  return 1
}

# ── Pokretanje provjera ───────────────────────────────────────

log "INFO" "========================================"
log "INFO" "QuizMaster Health Check — START"
log "INFO" "========================================"

EXIT_CODE=0

check_url "$FRONTEND_URL"          "Frontend" || EXIT_CODE=1
check_url "$BACKEND_URL/quizzes"   "Backend (quizzes endpoint)" || EXIT_CODE=1
check_url "$BACKEND_URL/users"     "Backend (users endpoint)"   || EXIT_CODE=1

# ── Rezultat ─────────────────────────────────────────────────

log "INFO" "========================================"
if [ "$EXIT_CODE" -eq 0 ]; then
  log "OK" "Svi servisi su zdravi. Deployment uspješan."
else
  log "ERROR" "Jedan ili više servisa nisu dostupni. Provjerite logove."
fi
log "INFO" "Log sačuvan u: $LOG_FILE"
log "INFO" "========================================"

exit "$EXIT_CODE"