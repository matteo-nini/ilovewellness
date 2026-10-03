#!/usr/bin/env bash
# Applica stub Supabase + migrazioni + seed su un database Postgres usa-e-getta
# ed esegue i test SQL. Richiede Postgres 15+ con PostGIS e btree_gist.
#   uso: supabase/tests/run.sh            (DB "ilw_test" sul Postgres locale)
#        PGHOST=... PGUSER=... supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB="${TEST_DB:-ilw_test}"
PSQL=(psql -X -v ON_ERROR_STOP=1 -q -d "$DB")

dropdb --if-exists "$DB"
createdb "$DB"
"${PSQL[@]}" -f tests/00_supabase_stub.sql
for f in migrations/*.sql; do
  echo "→ $f"
  "${PSQL[@]}" -f "$f"
done
echo "→ seed.sql"
"${PSQL[@]}" -f seed.sql
for f in tests/[1-9]*.sql; do
  echo "→ $f"
  "${PSQL[@]}" -o /dev/null -f "$f" 2>&1 | sed 's/^psql:[^ ]* NOTICE:  /  /' 
done
