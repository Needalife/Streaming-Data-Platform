#!/bin/sh

# Start Sentinel with the minimal configuration in the background.
redis-server /etc/redis/sentinel.conf --sentinel &

# Wait for a longer time to allow Docker DNS to settle.
sleep 20

# Try to resolve the IP address of redis-master.
MASTER_IP=$(getent hosts redis-master | awk '{print $1}')

if [ -z "$MASTER_IP" ]; then
  echo "ERROR: Could not resolve redis-master"
  exit 1
fi

echo "Resolved redis-master to $MASTER_IP"

# Configure Sentinel using the resolved IP address.
redis-cli -p 26379 SENTINEL MONITOR mymaster $MASTER_IP 6379 2
redis-cli -p 26379 SENTINEL SET mymaster auth-pass someStrongPassword
redis-cli -p 26379 SENTINEL SET mymaster down-after-milliseconds 5000
redis-cli -p 26379 SENTINEL SET mymaster parallel-syncs 1
redis-cli -p 26379 SENTINEL SET mymaster failover-timeout 10000

# Keep the container running.
wait