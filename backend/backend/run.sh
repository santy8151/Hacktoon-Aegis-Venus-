#!/bin/bash
# ─────────────────────────────────────────
# Reinicia el servidor Flask limpiamente
# Uso: ./run.sh
# ─────────────────────────────────────────

PORT=${PORT:-5000}

echo "🔍 Verificando puerto $PORT..."
PID=$(lsof -ti :$PORT)

if [ -n "$PID" ]; then
    echo "⚠️  Puerto $PORT ocupado (PID: $PID). Liberando..."
    kill -9 $PID 2>/dev/null
    sleep 1
    echo "✅ Puerto liberado"
else
    echo "✅ Puerto $PORT disponible"
fi

echo "🚀 Iniciando servidor..."
python app.py
