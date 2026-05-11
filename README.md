# qr-receipt-tz

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A Deno-based tool to read and verify Tanzanian tax receipts from QR codes by scraping the official TRA verification portal.

## Demo

**Live Demo: [qr-receipt-tz.sabae.cc](https://qr-receipt-tz.sabae.cc/)**

The web interface allows you to scan a receipt's QR code using your device's camera. The application then fetches the official receipt data, parses it into a structured format, and displays the itemized list and totals. It also includes a simple currency converter for JPY and USD.

## Features

-   **QR Code Scanning:** A simple web UI for scanning receipt QR codes directly in the browser.
-   **Data Parsing:** Scrapes and parses the HTML from the TRA verification portal into structured JSON.
-   **Dual-Mode Operation:** Can be run as a command-line tool for single lookups or as a persistent web server with a JSON API.
-   **Official Data Source:** Verifies receipts by fetching data directly from the Tanzania Revenue Authority (TRA) portal: [https://verify.tra.go.tz/](https://verify.tra.go.tz/).

## How It Works

Tanzanian receipt QR codes contain a URL pointing to the TRA verification portal, which includes a unique verification code. However, accessing this URL is only the first step. To retrieve the full receipt, the exact time of purchase (in `hh:mm:ss` format) printed on the receipt is also required.

This tool automates the two-step verification process:
1.  It makes an initial request to the verification URL to establish a session.
2.  It uses the session and the provided time to make a second request, which returns the full receipt as an HTML page.
3.  It then parses this HTML to extract all relevant information into a clean JSON object.

## Usage

### Prerequisites

-   [Deno](https://deno.land/) runtime

### As a Command-Line Tool (CLI)

To verify a single receipt, run `cli.js` with the verification code and time as an argument. The argument must be in the format `VERIFICATIONCODE_hhmmss`.

```sh
# deno run -A cli.js {VERIFICATIONCODE}_{hhmmss}
deno run -A cli.js 96D5B7166009_212046
```

The parsed receipt data will be printed to the console as a JSON object.

### As a Web Server

To start the web server and API:

```sh
deno serve -A --port 8888 --host "[::]" qr-receipt-tz.js
```

-   The web interface will be available at `http://localhost:8888`.
-   The API endpoint will be available at `http://localhost:8888/api/getReceipt`.

## API

### `GET /api/getReceipt`

Fetches and parses receipt data from the TRA portal.

-   **Query Parameter:** The `vcode_hhmmss` string (e.g., `96D5B7166009_212046`) should be passed as the query parameter.
-   **Example Request:** `GET /api/getReceipt?96D5B7166009_212046`
-   **Success Response:** A JSON object containing the parsed receipt details. See [`static/demo.json`](./static/demo.json) for a sample response.

## Deployment (Example with Nginx)

The following is an example of deploying the application on a server using Nginx as a reverse proxy and Certbot for SSL.

1.  **Set DNS Record:**
    Point your domain (e.g., `qr-receipt-tz.sabae.cc`) to your server's IP address.
    ```
    # Type  Name             Value
    A       qr-receipt-tz    118.27.2.240
    ```

2.  **Configure Nginx:**
    Create an Nginx configuration file to proxy requests to the Deno application.
    ```sh
    sudo cat << EOF > /etc/nginx/conf.d/qr-receipt-tz.sabae.cc.conf
    server {
      listen 80;
      server_name qr-receipt-tz.sabae.cc;
      location / {
        proxy_pass http://localhost:8017/;
      }
    }
    EOF
    ```

3.  **Reload Nginx & Obtain SSL Certificate:**
    ```sh
    sudo nginx -s reload
    sudo certbot --nginx -d qr-receipt-tz.sabae.cc
    ```

4.  **Create a Dedicated User:**
    ```sh
    sudo adduser qr-receipt-tz
    sudo chmod 755 /home/qr-receipt-tz
    sudo passwd qr-receipt-tz
    ```

5.  **Clone and Run the Application:**
    Switch to the new user, clone the repository, and start the Deno server.
    ```sh
    # Switch to the new user
    su qr-receipt-tz
    cd /home/qr-receipt-tz

    # Clone the repository
    git clone https://github.com/code4fukui/qr-receipt-tz.git
    cd qr-receipt-tz

    # Run the server in the background using nohup
    nohup deno serve -A --port 8017 --host "[::]" qr-receipt-tz.js &
    ```
    Your application is now live at `https://qr-receipt-tz.sabae.cc/`.

## Credits

This project is built with and inspired by the open-source tools from [Code for FUKUI](https://github.com/code4fukui).

## License

[MIT](https://github.com/code4fukui/qr-receipt-tz/blob/main/LICENSE)