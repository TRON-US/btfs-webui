#!/bin/bash

ALLOW_ORIGINS='"http://localhost:3000"'

# stop executing if anything fails
set -e

btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[$ALLOW_ORIGINS]"
btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'

echo "BTFS API CORS headers configured for $ALLOW_ORIGINS"
echo "Please restart your BTFS daemon"
