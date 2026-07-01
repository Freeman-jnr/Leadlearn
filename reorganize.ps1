$root = "c:\Users\USER\Desktop\leadlearnhub"
$frontend = "$root\frontend"
$backend = "$root\backend"

# Create frontend directory
New-Item -ItemType Directory -Path $frontend -Force | Out-Null
Write-Host "✓ Created frontend/ directory"

# Move source directories
Move-Item -Path "$root\src" -Destination "$frontend\src" -Force
Write-Host "✓ Moved src/ -> frontend/src/"

Move-Item -Path "$root\public" -Destination "$frontend\public" -Force
Write-Host "✓ Moved public/ -> frontend/public/"

# Move config files
Move-Item -Path "$root\package.json" -Destination "$frontend\package.json" -Force
Write-Host "✓ Moved package.json"

Move-Item -Path "$root\vite.config.ts" -Destination "$frontend\vite.config.ts" -Force
Write-Host "✓ Moved vite.config.ts"

Move-Item -Path "$root\tsconfig.json" -Destination "$frontend\tsconfig.json" -Force
Write-Host "✓ Moved tsconfig.json"

Move-Item -Path "$root\components.json" -Destination "$frontend\components.json" -Force
Write-Host "✓ Moved components.json"

Move-Item -Path "$root\eslint.config.js" -Destination "$frontend\eslint.config.js" -Force
Write-Host "✓ Moved eslint.config.js"

Move-Item -Path "$root\wrangler.jsonc" -Destination "$frontend\wrangler.jsonc" -Force
Write-Host "✓ Moved wrangler.jsonc"

# Move env files
Move-Item -Path "$root\.env" -Destination "$frontend\.env" -Force
Write-Host "✓ Moved .env"

Move-Item -Path "$root\.env.example" -Destination "$frontend\.env.example" -Force
Write-Host "✓ Moved .env.example"

Move-Item -Path "$root\.prettierrc" -Destination "$frontend\.prettierrc" -Force
Write-Host "✓ Moved .prettierrc"

Move-Item -Path "$root\.prettierignore" -Destination "$frontend\.prettierignore" -Force
Write-Host "✓ Moved .prettierignore"

# Move lock files
if (Test-Path "$root\bun.lock") {
    Move-Item -Path "$root\bun.lock" -Destination "$frontend\bun.lock" -Force
    Write-Host "✓ Moved bun.lock"
}

Move-Item -Path "$root\package-lock.json" -Destination "$frontend\package-lock.json" -Force
Write-Host "✓ Moved package-lock.json"

# Move node_modules (this may take a moment on Windows due to size)
Write-Host "Moving node_modules/ (this may take a moment)..."
Move-Item -Path "$root\node_modules" -Destination "$frontend\node_modules" -Force
Write-Host "✓ Moved node_modules/"

# Backend moves
Move-Item -Path "$root\prisma" -Destination "$backend\prisma" -Force
Write-Host "✓ Moved prisma/ -> backend/prisma/"

Move-Item -Path "$root\swagger.json" -Destination "$backend\swagger.json" -Force
Write-Host "✓ Moved swagger.json -> backend/swagger.json"

Write-Host ""
Write-Host "All files moved successfully!"
