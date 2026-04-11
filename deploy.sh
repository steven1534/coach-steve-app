#!/bin/bash
set -e

echo "========================================="
echo "  Coach Steve — VPS Deploy Script"
echo "========================================="

# --- Step 1: System update ---
echo ""
echo "[1/6] Updating system..."
sudo apt update && sudo apt upgrade -y

# --- Step 2: Install Node.js 20 LTS ---
echo ""
echo "[2/6] Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo "Node: $(node -v) | npm: $(npm -v)"

# --- Step 3: Install PM2 + Nginx ---
echo ""
echo "[3/6] Installing PM2 and Nginx..."
sudo npm install -g pm2
sudo apt install -y nginx

# --- Step 4: Clone and build the app ---
echo ""
echo "[4/6] Cloning repo and building..."
if [ -d "/var/www/coach-steve" ]; then
    echo "Directory exists, pulling latest..."
    cd /var/www/coach-steve
    git pull
else
    git clone https://github.com/steven1534/coach-steve-app.git /var/www/coach-steve
    cd /var/www/coach-steve
    git checkout cursor/initial-fullstack-scaffold
fi

npm install

echo "Building frontend..."
npx vite build

# --- Step 5: Create .env ---
echo ""
echo "[5/6] Setting up environment..."
if [ ! -f .env ]; then
    cat > .env << 'ENVFILE'
GEMINI_API_KEY=AIzaSyCPPRoZ0rv83302uZg8LnJyr5moXKsKSP8
NODE_ENV=production
PORT=3000
ENVFILE
    echo ".env created"
else
    echo ".env already exists, skipping"
fi

# Create uploads and data directories
mkdir -p uploads data

# --- Step 6: Start with PM2 ---
echo ""
echo "[6/6] Starting app with PM2..."
pm2 delete coach-steve 2>/dev/null || true
pm2 start npx --name coach-steve -- tsx server/index.ts
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

echo ""
echo "========================================="
echo "  App is running on port 3000!"
echo "  Test: curl http://localhost:3000"
echo ""
echo "  Next: set up Nginx + domain + SSL"
echo "  (run setup-nginx.sh after pointing"
echo "   your domain to 72.60.172.237)"
echo "========================================="
