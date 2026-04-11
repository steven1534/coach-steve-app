#!/bin/bash
set -e

# Usage: ./setup-nginx.sh yourdomain.com
DOMAIN=${1:-""}

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./setup-nginx.sh yourdomain.com"
    echo "Example: ./setup-nginx.sh coachsteve.com"
    exit 1
fi

echo "========================================="
echo "  Setting up Nginx + SSL for $DOMAIN"
echo "========================================="

# --- Nginx config ---
echo ""
echo "[1/3] Creating Nginx config..."
sudo tee /etc/nginx/sites-available/coach-steve > /dev/null << NGINXCONF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 200M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXCONF

# --- Enable site ---
echo ""
echo "[2/3] Enabling site..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/coach-steve /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "Nginx configured! http://$DOMAIN should now work."

# --- SSL ---
echo ""
echo "[3/3] Installing SSL certificate..."
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo ""
echo "========================================="
echo "  Done! Your app is live at:"
echo "  https://$DOMAIN"
echo "========================================="
