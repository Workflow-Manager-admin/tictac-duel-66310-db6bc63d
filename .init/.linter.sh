#!/bin/bash
cd /home/kavia/workspace/code-generation/tictac-duel-66310-db6bc63d/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

