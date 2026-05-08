#!/bin/bash

SESSION="conexao_monstrinho"
PYTHON="/home/pi/MDIS/mdis/venv/bin/python"
SCRIPT="/home/pi/MDIS/mdis/main.py"

if tmux has-session -t $SESSION 2>/dev/null; then
    echo "⚠️ A sessão '$SESSION' já está em execução."
else
    echo "🚀 Iniciando sessão '$SESSION'..."
    tmux new-session -d -s $SESSION "$PYTHON $SCRIPT"
    echo "✅ Sessão '$SESSION' criada."
fi