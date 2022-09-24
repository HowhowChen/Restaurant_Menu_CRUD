# Restaurant_Menu_CRUD

# 餐廳清單

1. 該專案提供餐廳查詢服務，俾利使用者能以最短的時間找出評價高的美食。
2. 新增CRUD功能，使用者能自由新增、刪除及修改餐廳資料。
3. 導入分頁功能，優化使用者瀏覽餐廳資料。
4. 新增排序功能，給使用者更多瀏覽餐廳資料的選擇。
5. 新增會員功能並提供多種登入方式。
6. 新增錯誤頁面404，500。


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
  * 每頁顯示12筆餐廳，超過即換頁顯示
  * 分頁導覽列最多一次顯示五頁
  
* 排序功能
  * 類別
  * 地區
  * 評價由高到低(🌟大到小)
  * 評價由低到高(🌟小到大)
  
* 會員功能
  * Email登入
  * Facebook帳戶登入
  * Google帳戶登入
  
* 錯誤頁面
  * 404 使用者搜尋錯誤路徑
  * 500 伺服器端發現異常

## 畫面預覽

![login](https://user-images.githubusercontent.com/106914854/192088949-0d07b529-91af-4362-9c11-d18c3f90c4ef.PNG)

![register](https://user-images.githubusercontent.com/106914854/192088979-849e8e1d-b193-4613-bdf0-7463f9312d21.PNG)



![error_page](https://user-images.githubusercontent.com/106914854/192088894-31d43551-dd4e-4996-963c-7ac5a4e03273.gif)


![error_page_404](https://user-images.githubusercontent.com/106914854/192088909-735ac7a9-b8d6-4dd6-aa70-fe8e1a52c844.gif)




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
4. 安裝nodemon
```
npm i nodemon
```

5. 建立檔案.env，將環境變數寫入其中(相關變數請參考.env.example)

6. 使用種子資料，請在終端機輸入：

```
npm run seed
```

7. 執行專案，請在終端機輸入：
```
npm run dev
```

8. 輸入下列代碼於**網址列**即可使用
```
localhost:3000
```

9. 若欲暫停使用：

```
ctrl + c
```


## 開發者
Howhow Chen
