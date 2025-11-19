#!/bin/bash
# Temporary script to list files that need params fix
echo "API routes with dynamic params:"
find src/app/api -name "route.ts" -path "*/\[*\]/*"
