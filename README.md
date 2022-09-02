# Restaurant_Menu_CRUD

# 餐廳清單

1. 該專案提供餐廳查詢服務，俾利使用者能以最短的時間找出評價高的美食。
2. 新增CRUD功能，使用者能自由新增、刪除及修改餐廳資料。
3. 導入分頁功能，優化使用者瀏覽餐廳資料。

## 功能列表

* 使用者可以在首頁概覽所有餐廳：

  * 照片
  * 名稱
  * 分類
  * 評分

* 使用者可以點選個別餐廳查看詳細資訊：

  * 類別
  * 地址
  * 電話
  * 描述
  * 圖片
  
* 使用者點選地址旁的小圖標 <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/location-arrow.svg" width="15" height="15"> 可連結到 Google Map

* 使用者可以有多種方式搜尋餐廳：
  * 餐廳名稱
  * 餐廳類別

*  使用者可以依照評價高低由上到下排序餐廳:
   * 評價由高到低(🌟由大到小)
   * 評價由低到高(🌟由小到大)
   
* 使用者可以自由新增、修改及刪除餐廳資料

* 使用者查詢餐廳名稱英文將忽略大小寫模糊查詢

* 分頁功能
  * 每頁顯示12頁，超過即換頁顯示
  * 分頁導覽列最多一次顯示五頁
  


## 畫面預覽
![indexPage](https://user-images.githubusercontent.com/106914854/188093079-ea306de8-c35f-4e1d-9eaa-2649e54a13ed.PNG)

---
![createForm](https://user-images.githubusercontent.com/106914854/188093092-38dee6a6-2089-461f-a954-ddc08a258c5b.PNG)

---
![Pagination](https://user-images.githubusercontent.com/106914854/188095318-da3de323-142b-434f-8a14-7fd99c8b5926.PNG)

---
![searchPagination](https://user-images.githubusercontent.com/106914854/188095876-1a2b20ca-fa4a-4f60-8302-9ce1ff8a5c96.PNG)




## 安裝
1. Clone 此專案至本機電腦，打開 terminal 至欲存放專案之資料夾，輸入下列代碼 
```
git clone https://github.com/HowhowChen/Restaurant_Menu_CRUD.git
```
2. 進入專案資料夾，請在終端機輸入：
```
cd Restaurant_Menu_CRUD
```
3. 安裝 npm 套件，請在終端機輸入：
```
npm install
```
4. 使用種子資料，請在終端機輸入：

```
npm run seed
```

5. 執行專案，請在終端機輸入：
```
npm run dev
```

6. 輸入下列代碼於**網址列**即可使用
```
localhost:3000
```

7. 若欲暫停使用：

```
ctrl + c
```


## 開發者
Howhow Chen
