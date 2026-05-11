# qr-receipt-tz

公式のTRA（タンザニア歳入庁）検証ポータルをスクレイピングすることで、QRコードからタンザニアの領収書を読み取り、検証するDenoベースのツールです。

## デモ

**ライブデモ: [qr-receipt-tz.sabae.cc](https://qr-receipt-tz.sabae.cc/)**

Webインターフェースでは、デバイスのカメラを使用して領収書のQRコードをスキャンできます。スキャン後、アプリケーションが公式の領収書データを取得し、構造化されたフォーマットにパースして、品目リストと合計金額を表示します。また、日本円（JPY）と米ドル（USD）の簡易的な通貨換算機能も備えています。

## 機能

- **QRコードスキャン:** ブラウザ上で直接領収書のQRコードをスキャンできるシンプルなWeb UI。
- **データパース:** TRA検証ポータルのHTMLをスクレイピングし、構造化されたJSONデータにパースします。
- **デュアルモード動作:** 単発の照会を行うコマンドラインツールとして、またはJSON APIを提供する常駐Webサーバーとして実行可能です。
- **公式データソース:** タンザニア歳入庁（TRA）のポータルから直接データを取得して領収書を検証します: [https://verify.tra.go.tz/](https://verify.tra.go.tz/)。

## 動作原理

タンザニアの領収書のQRコードには、TRA検証ポータルへのURLが含まれており、そこには固有の検証コードが含まれています。しかし、このURLにアクセスするのは最初のステップに過ぎません。領収書の完全なデータを取得するには、領収書に印字されている正確な購入時刻（`hh:mm:ss`形式）も必要になります。

このツールは、以下の2段階の検証プロセスを自動化します：
1. 検証URLに最初のリクエストを送信し、セッションを確立します。
2. そのセッションと指定された時刻を使用して2回目のリクエストを行い、完全な領収書をHTMLページとして取得します。
3. 取得したHTMLをパースし、すべての関連情報を抽出してクリーンなJSONオブジェクトに変換します。

## 使い方

### 必須条件

- [Deno](https://deno.land/) ランタイム

### コマンドラインツール（CLI）として

単一の領収書を検証するには、検証コードと時刻を引数として `cli.js` を実行します。引数は `VERIFICATIONCODE_hhmmss` の形式である必要があります。

```sh
# deno run -A cli.js {VERIFICATIONCODE}_{hhmmss}
deno run -A cli.js 96D5B7166009_212046
```

パースされた領収書データがJSONオブジェクトとしてコンソールに出力されます。

### Webサーバーとして

WebサーバーおよびAPIを起動するには：

```sh
deno serve -A --port 8888 --host "[::]" qr-receipt-tz.js
```

- Webインターフェースは `http://localhost:8888` で利用可能になります。
- APIエンドポイントは `http://localhost:8888/api/getReceipt` で利用可能になります。

## API

### `GET /api/getReceipt`

TRAポータルから領収書データを取得し、パースします。

- **クエリパラメータ:** `vcode_hhmmss` 形式の文字列（例: `96D5B7166009_212046`）をクエリパラメータとして渡します。
- **リクエスト例:** `GET /api/getReceipt?96D5B7166009_212046`
- **成功レスポンス:** パースされた領収書の詳細を含むJSONオブジェクト。レスポンスのサンプルは [`static/demo.json`](./static/demo.json) を参照してください。

## デプロイ（Nginxでの例）

以下は、Nginxをリバースプロキシとして使用し、CertbotでSSL化してサーバーにアプリケーションをデプロイする例です。

1. **DNSレコードの設定:**
   ドメイン（例: `qr-receipt-tz.sabae.cc`）をサーバーのIPアドレスに向けます。
   ```
   # Type  Name             Value
   A       qr-receipt-tz    118.27.2.240
   ```

2. **Nginxの設定:**
   DenoアプリケーションへのリクエストをプロキシするNginx設定ファイルを作成します。
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

3. **Nginxの再読み込みとSSL証明書の取得:**
   ```sh
   sudo nginx -s reload
   sudo certbot --nginx -d qr-receipt-tz.sabae.cc
   ```

4. **専用ユーザーの作成:**
   ```sh
   sudo adduser qr-receipt-tz
   sudo chmod 755 /home/qr-receipt-tz
   sudo passwd qr-receipt-tz
   ```

5. **アプリケーションのクローンと実行:**
   新しいユーザーに切り替えて、リポジトリをクローンし、Denoサーバーを起動します。
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
   これでアプリケーションが `https://qr-receipt-tz.sabae.cc/` で公開されます。

## クレジット

このプロジェクトは、[Code for FUKUI](https://github.com/code4fukui) のオープンソースツールを活用し、そこからインスピレーションを得て構築されています。

## ライセンス

[MIT](https://github.com/code4fukui/qr-receipt-tz/blob/main/LICENSE)
