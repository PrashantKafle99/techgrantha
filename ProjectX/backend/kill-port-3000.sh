#!/bin/bash

echo "Finding process using port 3000..."
PORT_PID=$(lsof -ti:3000)

if [ -z "$PORT_PID" ]; then
    echo "No process found using port 3000"
else
    echo "Found process(es) using port 3000: $PORT_PID"
    echo "Killing process(es)..."
    kill -9 $PORT_PID
    echo "Process(es) killed successfully"
fi

echo ""
echo "Verifying port 3000 is free..."
sleep 1
lsof -i:3000 || echo "Port 3000 is now free!"
