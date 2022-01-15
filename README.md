# NTUEE 109-2 電資入門設計與實作 循跡演算法測試網站

## 感謝

此repo內的程式碼大部分承襲自於108-2的repo:https://github.com/jchen8tw/Creative-cornerstone-dashboard?fbclid=IwAR2n9W32Mk-8h-_YJX9NxkrRlqMK45TuCzgjJqQLL4W-0hBTw6T97r6DZ90

感謝108-2的助教開源程式碼

109-2修改了前端，並修正了一些disconnection及TA.py的bug。

## 前置作業

前往此網站：https://nodejs.org/en/ ，下載安裝node.js

檢查Node.js及npm是否正確安裝

```bash
node -v
npm -v

```

安裝npm套件yarn，並且檢查是否安裝成功

```bash
npm install -g yarn
yarn --version

```

## 使用說明

進入Server資料夾輸入yarn便會自動根據package.json在node_modules裡面下載所有程式需要的套件

cd Server
yarn
yarn dev


啟動成功後便可以打開瀏覽器，在網址列輸入：http://localhost::4000 ，即可看到運行中的伺服器

若 http://localhost::4000 沒有畫面，請至cmd中輸入ipconfig查詢ipv4，將localhost改成該ipv4即可

接著進入Python資料夾，main.py是完整的指定題code，需要連結車子的藍芽模組，並且透過車子的藍芽回傳RFID的UID才能夠使用

如果只是要測試伺服器的話不需要這麼麻煩，我們只需要使用score.py即可

請修改score.py第24行的ip位置，也請修改第125行的'隊伍名稱'為任意隊伍名稱

執行score.py

```bash
python score.py

```

在瀏覽器上應該可以看到右方出現一些資訊，並且時間開始倒數

此外，可以利用TA.py來結束遊戲、扣分及重置伺服器，請一樣先修改第6行的ip位置

若要結束遊戲，請輸入以下指令：

```bash
python TA.py stop

```

若學生碰觸自走車，每一次扣要50分，請輸入以下指令：

```bash
python TA.py deduct

```

若要修改已經在左側記分板上的分數，請輸入以下指令：

```bash
python TA.py set_score

```

若要清空排行榜並重置server，請輸入以下指令：

```bash
python TA.py reset

```

更詳細的api doc，請參閱```/router/apidoc-out/index.html```，或看[網頁版](https://htmlpreview.github.io/?https://github.com/Claude0311/NTUEE-cornerstone-server/blob/main/Server/router/apidoc-out/index.html)
