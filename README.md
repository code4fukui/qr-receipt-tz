# qr-receipt-tz

Tanzania Receipt QR Reader

## Usage as CLI

```sh
deno run -A cli.js verifycode_hhmmss
```

## Usage as server

```sh
deno serve -A --port 8888 --host "[::]" qr-receipt-tz.js
```

## setup

- domain setting
a qr-receipt-tz 118.27.2.240

- on server

```sh
sudo cat << EOF > /etc/nginx/conf.d/qr-receipt-tz_sabae_cc.conf
server {
  listen 80;
  server_name qr-receipt-tz.sabae.cc;
  location / {
    proxy_pass http://localhost:8017/;
  }
}
EOF

sudo nginx -s reload
./certbot-auto

adduser qr-receipt-tz; chmod 755 /home/qr-receipt-tz; passwd qr-receipt-tz

cd /home/qr-receipt-tz; su qr-receipt-tz

git clone https://github.com/code4fukui/qr-receipt-tz.git
cd qr-receipt-tz

nohup deno serve -A --port 8017 --host "[::]" qr-receipt-tz.js &
```

open https://qr-receipt-tz.sabae.cc/
