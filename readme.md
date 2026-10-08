---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：415730828　　姓名：周忻豫

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）
答對的畫面
![螢幕擷取畫面 2026-10-08 152713](https://hackmd.io/_uploads/rJewL6NiMl.png)
![動畫](https://hackmd.io/_uploads/r1PP86EiGx.gif)





### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```使用p5.js撰寫一個選擇題網頁測驗系統，我已經使用p5.js撰寫一個選擇題網頁測驗系統，我已經產生一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都需要加上中文註解，測驗系統題目設定為五題，測驗題目的內容為程式設計p5.js簡易指令練習測驗，系統採用全螢幕畫布，使用者答錯時，系統會在正確答案選項上，加上fefae0背景顏色，該選項要上下跳動，答錯的選項採用e63946背景顏色，選項左右移動。選擇題選項共有三個選項，當五題結束後，需要顯示答對的題數，每次顯示一個題目，需要有下一題的按鈕，整個頁面都要置中


### 程式碼內容

// 定義全域變數
let questions = []; // 儲存所有測驗題目的陣列
let currentQuestionIndex = 0; // 當前正在進行的題目索引 (0 到 4)
let score = 0; // 使用者答對的總題數
let selectedOption = -1; // 使用者點選的選項 index (-1 表示尚未選擇)
let isAnswered = false; // 紀錄當前題目是否已經回答過
let animTimer = 0; // 用於控制動畫的時間計數器
let nextButton; // 下一題按鈕物件

function setup() {
  // 建立全螢幕畫布，並設定畫布放置於螢幕中央
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); // 將畫布定位在視窗左上角，佔滿全螢幕
  
  // 文字對齊設定為水平與垂直皆置中
  textAlign(CENTER, CENTER);

  // 初始化 5 道 p5.js 基礎語法測驗題目
  questions = [
    {
      q: "1. 在 p5.js 中，設定畫布大小的指令是什麼？",
      options: ["createCanvas()", "setSize()", "makeCanvas()"],
      answer: 0 // 正確答案為第一個選項 (index 0)
    },
    {
      q: "2. 哪一個函式會在程式啟動時只執行一次，常用於初始化設定？",
      options: ["draw()", "setup()", "start()"],
      answer: 1 // 正確答案為第二個選項 (index 1)
    },
    {
      q: "3. 若要設定圖形的背景顏色，應該使用哪一個指令？",
      options: ["color()", "fill()", "background()"],
      answer: 2 // 正確答案為第三個選項 (index 2)
    },
    {
      q: "4. 下列哪一個指令可以用來繪製一個圓形？",
      options: ["circle()", "square()", "triangle()"],
      answer: 0 // 正確答案為第一個選項 (index 0)
    },
    {
      q: "5. 若要填充圖形內部的顏色，應該呼叫哪一個指令？",
      options: ["stroke()", "fill()", "style()"],
      answer: 1 // 正確答案為第二個選項 (index 1)
    }
  ];

  // 建立「下一題」按鈕並設定樣式與位置
  nextButton = createButton("下一題");
  nextButton.size(120, 45); // 設定按鈕寬高
  nextButton.style('font-size', '18px'); // 設定按鈕文字大小
  nextButton.style('border-radius', '8px'); // 設定按鈕圓角
  nextButton.style('cursor', 'pointer'); // 設定滑鼠游標圖示
  nextButton.position(width / 2 - 60, height / 2 + 180); // 將按鈕置中放置於畫面下方
  nextButton.mousePressed(nextQuestion); // 綁定點擊事件至 nextQuestion 函式
  nextButton.hide(); // 初始狀態隱藏按鈕，等回答後才顯示
}

function draw() {
  // 設定畫布背景為淡灰色
  background(240);
  
  // 累加動畫時間計數器
  animTimer += 0.1;

  // 判斷是否所有題目均已回答完畢
  if (currentQuestionIndex < questions.length) {
    // 若尚未結束，繪製當前測驗題目畫面
    drawQuiz();
  } else {
    // 若 5 題皆已結束，繪製結算計分畫面
    drawResult();
  }
}

// 繪製測驗題目的函式
function drawQuiz() {
  let qData = questions[currentQuestionIndex]; // 取得當前題目的資料

  // 繪製題目文字
  fill(30); // 設定文字顏色為深灰色
  textSize(24); // 設定題目文字大小
  text(qData.q, width / 2, height / 2 - 140); // 在畫面上方中央繪製題目

  // 循環繪製 3 個選項
  for (let i = 0; i < 3; i++) {
    let x = width / 2; // 選項中心點的 X 座標
    let y = height / 2 - 40 + i * 70; // 選項中心點的 Y 座標 (間隔 70px)
    let w = 320; // 選項框寬度
    let h = 50;  // 選項框高度

    let currentBg = color(255); // 預設選項背景顏色為白色
    let offsetX = 0; // X 軸位移量 (用於左右振動動畫)
    let offsetY = 0; // Y 軸位移量 (用於上下跳動動畫)

    // 判斷使用者是否已經點選回答
    if (isAnswered) {
      if (i === qData.answer) {
        // 如果是正確答案選項
        currentBg = color('#fefae0'); // 設定特定淡黃色背景
        if (selectedOption !== qData.answer) {
          // 當答錯時，正確答案選項會產生上下跳動效果
          offsetY = sin(animTimer * 5) * 8;
        }
      } else if (i === selectedOption) {
        // 如果是使用者選錯的選項
        currentBg = color('#e63946'); // 設定紅色背景
        // 答錯的選項會產生左右搖晃位移效果
        offsetX = sin(animTimer * 10) * 8;
      }
    }

    // 保存目前的繪圖狀態
    push();
    // 根據動畫位移移動畫布座標系
    translate(x + offsetX, y + offsetY);

    // 繪製選項框
    stroke(200); // 設定邊框顏色
    strokeWeight(1.5); // 設定邊框粗細
    fill(currentBg); // 設定填充顏色
    rectMode(CENTER); // 設定矩形繪製模式為中心對齊
    rect(0, 0, w, h, 10); // 繪製圓角矩形

    // 繪製選項文字
    noStroke(); // 文字不需要邊框
    if (isAnswered && i === selectedOption && selectedOption !== qData.answer) {
      fill(255); // 若為答錯的選項，文字轉為白色以利辨識
    } else {
      fill(50); // 其餘情況文字為深灰色
    }
    textSize(18); // 設定選項文字大小
    text(qData.options[i], 0, 0); // 在選項框中央寫入文字

    // 恢復繪圖狀態
    pop();
  }
}

// 處理滑鼠點擊選擇選項的事件
function mousePressed() {
  // 若當前題目已回答過或測驗已結束，則不處理選項點擊
  if (isAnswered || currentQuestionIndex >= questions.length) {
    return;
  }

  // 檢查滑鼠是否點擊在 3 個選項的範圍內
  for (let i = 0; i < 3; i++) {
    let x = width / 2;
    let y = height / 2 - 40 + i * 70;
    let w = 320;
    let h = 50;

    // 邊界條件判斷：滑鼠座標是否落於該選項矩形內
    if (mouseX > x - w / 2 && mouseX < x + w / 2 &&
        mouseY > y - h / 2 && mouseY < y + h / 2) {
      selectedOption = i; // 紀錄使用者點選的選項 index
      isAnswered = true; // 標記此題已完成回答

      // 如果選中正確答案，增加得分
      if (selectedOption === questions[currentQuestionIndex].answer) {
        score++;
      }

      // 顯示「下一題」按鈕
      nextButton.show();
      break; // 找到對應選項後中斷迴圈
    }
  }
}

// 跳轉至下一題的邏輯函式
function nextQuestion() {
  currentQuestionIndex++; // 推進題目索引
  selectedOption = -1; // 重置點選選項狀態
  isAnswered = false; // 重置回答狀態
  nextButton.hide(); // 隱藏「下一題」按鈕
}

// 繪製最終結果畫面的函式
function drawResult() {
  fill(30); // 設定文字顏色
  textSize(32); // 設定標題文字大小
  text("測驗結束！", width / 2, height / 2 - 50); // 顯示測驗結束標題

  textSize(22); // 設定內文文字大小
  // 顯示使用者最終得分 (答對題數 / 總題數)
  text("你的得分為：" + score + " / " + questions.length + " 題", width / 2, height / 2 + 10);
}

// 當瀏覽器視窗大小改變時動態調整畫布與元素位置
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 重新調整畫布尺寸為全螢幕
  nextButton.position(width / 2 - 60, height / 2 + 180); // 重新定位下一題按鈕於中央
}

```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習2截圖](![螢幕擷取畫面 2026-10-08 153236](https://hackmd.io/_uploads/Hk5HDpNiMe.png)
)

### 第一次問 AI

```tex!
（使用p5.js撰寫一個選擇題網頁測驗系統，我已經使用p5.js撰寫一個選擇題網頁測驗系統，我已經產生一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都需要加上中文註解，測驗系統題目設定為五題，測驗題目的內容為程式設計p5.js簡易指令練習測驗，系統採用全螢幕畫布，使用者答錯時，系統會在正確答案選項上，加上fefae0背景顏色，該選項要上下跳動，答錯的選項採用e63946背景顏色，選項左右移動。選擇題選項共有三個選項，當五題結束後，需要顯示答對的題數，每次顯示一個題目，需要有下一題的按鈕，整個頁面都要置中
，幫我做滾動式的網頁，網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整）
```


```

### 程式碼內容
// 建立所有測驗題目資料庫
const quizQuestions = [
  {
    // 第一題題目
    question: "在 JavaScript 中，哪一個指令可以在主控台輸出文字？",
    // 第一題選項
    options: ["print()", "console.log()", "display()", "write()"],
    // 正確答案索引值 (對應 console.log())
    answer: 1
  },
  {
    // 第二題題目
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",
    // 第二題選項
    options: ["start()", "draw()", "setup()", "begin()"],
    // 正確答案索引值 (對應 setup())
    answer: 2
  },
  {
    // 第三題題目
    question: "在 JavaScript 中，哪一個指令可以宣告不可重新指定的變數？",
    // 第三題選項
    options: ["var", "let", "const", "fixed"],
    // 正確答案索引值 (對應 const)
    answer: 2
  },
  {
    // 第四題題目
    question: "在 p5.js 中，哪一個函式會重複執行以繪製動畫？",
    // 第四題選項
    options: ["setup()", "loop()", "draw()", "repeat()"],
    // 正確答案索引值 (對應 draw())
    answer: 2
  },
  {
    // 第五題題目
    question: "哪一個運算子可以比較兩個值是否相等且型別相同？",
    // 第五題選項
    options: ["=", "==", "===", "!="],
    // 正確答案索引值 (對應 ===)
    answer: 2
  }
];

// 宣告目前題目的索引值
let currentQuestion = 0;

// 宣告答對總題數
let score = 0;

// 宣告使用者點選的選項索引值 (-1 表示尚未選擇)
let selectedOption = -1;

// 宣告目前題目是否已經回答
let hasAnswered = false;

// 宣告測驗是否已經全部結束
let isFinished = false;

// 宣告儲存選項點擊範圍的陣列
let optionRects = [];

// 宣告「下一題」按鈕的點擊區域與尺寸設定
let nextButtonRect = {
  x: 0,
  y: 0,
  width: 200,
  height: 50
};

// 宣告「重新測驗」按鈕的點擊區域與尺寸設定
let restartButtonRect = {
  x: 0,
  y: 0,
  width: 200,
  height: 50
};

// p5.js 初始化設定函式
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字對齊方式為水平置中與垂直置中
  textAlign(CENTER, CENTER);
  // 設定矩形繪製模式為中心點對齊
  rectMode(CENTER);
}

// p5.js 主繪製循環函式 (每秒約 60 幀)
function draw() {
  // 設定畫布背景顏色 (淺灰背景)
  background(245);

  // 判斷測驗是否已經完成
  if (isFinished) {
    // 繪製結果畫面
    drawResultScreen();
  } else {
    // 繪製測驗畫面
    drawQuizScreen();
  }
}

// 繪製測驗畫面的主函式
function drawQuizScreen() {
  // 取得目前題目的資料
  let quiz = quizQuestions[currentQuestion];
  
  // 每次重繪前清空選項範圍陣列
  optionRects = [];

  // 設定測驗標題顏色
  fill(40);
  // 設定測驗標題文字大小
  textSize(28);
  // 繪製測驗標題
  text("程式設計簡易指令練習測驗", width / 2, height * 0.12);

  // 設定題數進度文字顏色
  fill(100);
  // 設定題數進度文字大小
  textSize(18);
  // 顯示目前題數與總題數
  text(`第 ${currentQuestion + 1} 題 / 共 ${quizQuestions.length} 題`, width / 2, height * 0.18);

  // 設定題目文字顏色
  fill(20);
  // 設定題目文字大小
  textSize(22);
  // 繪製題目文字
  text(quiz.question, width / 2, height * 0.28);

  // 計算選項區域的起始 Y 座標
  let startY = height * 0.4;
  // 設定選項垂直間距
  let gap = 70;
  // 設定選項矩形寬度
  let optionWidth = min(width * 0.8, 500);
  // 設定選項矩形高度
  let optionHeight = 50;

  // 迴圈繪製四個選項
  for (let i = 0; i < quiz.options.length; i++) {
    // 計算目前選項的 Y 座標
    let optionY = startY + i * gap;

    // 將選項點擊區域資料存入陣列
    optionRects.push({
      x: width / 2,
      y: optionY,
      width: optionWidth,
      height: optionHeight
    });

    // 呼叫繪製單一選項函式
    drawOption(i, quiz.options[i], width / 2, optionY, optionWidth, optionHeight);
  }

  // 若使用者已回答問題，顯示「下一題」或「查看結果」按鈕
  if (hasAnswered) {
    // 計算按鈕 Y 座標 (放置於最後一個選項下方)
    let buttonY = startY + 4 * gap + 20;
    // 更新「下一題」按鈕的位置資料
    nextButtonRect.x = width / 2;
    nextButtonRect.y = buttonY;

    // 判斷是否為最後一題以變更按鈕文字
    let btnText = (currentQuestion === quizQuestions.length - 1) ? "查看結果" : "下一題";
    
    // 繪製下一題按鈕背景 (藍色)
    fill(52, 152, 219);
    // 設定按鈕外框
    stroke(41, 128, 185);
    strokeWeight(2);
    // 繪製圓角矩形按鈕
    rect(nextButtonRect.x, nextButtonRect.y, nextButtonRect.width, nextButtonRect.height, 10);

    // 取消外框顏色設定
    noStroke();
    // 設定按鈕文字顏色 (白色)
    fill(255);
    // 設定按鈕文字大小
    textSize(20);
    // 繪製按鈕文字
    text(btnText, nextButtonRect.x, nextButtonRect.y);
  }
}

// 繪製單一選項與動畫的效果函式
function drawOption(index, optionText, x, y, w, h) {
  // 取得當前題目的正確答案索引
  let correctAnswer = quizQuestions[currentQuestion].answer;

  // 宣告動態偏移量 (預設無偏移)
  let offsetX = 0;
  let offsetY = 0;

  // 預設選項背景顏色 (純白)
  let bgColor = color(255);
  // 預設外框顏色 (淺灰色)
  let strokeColor = color(200);

  // 判斷使用者是否已經做答
  if (hasAnswered) {
    // 情況 1：此選項為正確答案
    if (index === correctAnswer) {
      // 套用正確答案指定的背景顏色 #fefae0
      bgColor = color("#fefae0");
      // 設定正確答案的外框顏色 (金黃色)
      strokeColor = color(241, 196, 15);

      // 若使用者回答錯誤，讓正確答案上下跳動
      if (selectedOption !== correctAnswer) {
        // 利用正弦波算式產生上下跳動效果
        offsetY = sin(frameCount * 0.2) * 8;
      }
    }
    // 情況 2：此選項為使用者選擇的錯誤答案
    else if (index === selectedOption) {
      // 套用答錯指定的背景顏色 #e63946
      bgColor = color("#e63946");
      // 設定錯誤答案的外框顏色
      strokeColor = color(192, 57, 43);

      // 讓答錯的選項左右移動震動
      offsetX = sin(frameCount * 0.4) * 10;
    }
  }

  // 套用外框線條屬性
  stroke(strokeColor);
  strokeWeight(2);
  // 套用背景填滿顏色
  fill(bgColor);

  // 繪製選項圓角矩形 (套用偏移量)
  rect(x + offsetX, y + offsetY, w, h, 8);

  // 取消繪製外框
  noStroke();

  // 若選項為點選的錯誤選項，文字轉為白色以利閱讀，其餘為深灰文字
  if (hasAnswered && index === selectedOption && selectedOption !== correctAnswer) {
    fill(255);
  } else {
    fill(50);
  }

  // 設定選項文字大小
  textSize(18);
  // 繪製選項文字 (套用偏移量)
  text(optionText, x + offsetX, y + offsetY);
}

// 繪製測驗結果頁面的函式
function drawResultScreen() {
  // 取消外框
  noStroke();

  // 設定結果標題顏色
  fill(40);
  // 設定結果標題文字大小
  textSize(32);
  // 繪製完成提示
  text("測驗完成！", width / 2, height * 0.3);

  // 設定成績文字顏色
  fill(41, 128, 185);
  // 設定成績文字大小
  textSize(28);
  // 顯示最終答對題數與總題數
  text(`您的成績為：答對 ${score} / ${quizQuestions.length} 題`, width / 2, height * 0.45);

  // 更新重新測驗按鈕位置
  restartButtonRect.x = width / 2;
  restartButtonRect.y = height * 0.6;

  // 設定按鈕外框
  stroke(39, 174, 96);
  strokeWeight(2);
  // 設定重新測驗按鈕顏色 (綠色)
  fill(46, 204, 113);
  // 繪製重新測驗按鈕
  rect(restartButtonRect.x, restartButtonRect.y, restartButtonRect.width, restartButtonRect.height, 10);

  // 取消外框
  noStroke();
  // 設定按鈕文字顏色 (白色)
  fill(255);
  // 設定按鈕文字大小
  textSize(20);
  // 繪製按鈕文字
  text("重新測驗", restartButtonRect.x, restartButtonRect.y);
}

// 監聽滑鼠點擊事件
function mousePressed() {
  // 若測驗已結束，檢查是否點擊「重新測驗」按鈕
  if (isFinished) {
    if (isInside(mouseX, mouseY, restartButtonRect)) {
      // 重設所有測驗相關變數以重頭開始
      currentQuestion = 0;
      score = 0;
      selectedOption = -1;
      hasAnswered = false;
      isFinished = false;
    }
    return;
  }

  // 若尚未回答，檢查是否點擊四個選項之一
  if (!hasAnswered) {
    for (let i = 0; i < optionRects.length; i++) {
      if (isInside(mouseX, mouseY, optionRects[i])) {
        // 記錄選擇的選項
        selectedOption = i;
        // 標記為已回答
        hasAnswered = true;

        // 判斷是否答對
        if (selectedOption === quizQuestions[currentQuestion].answer) {
          // 答對則累加分數
          score++;
        }
        break;
      }
    }
  } 
  // 若已回答，檢查是否點擊「下一題 / 查看結果」按鈕
  else {
    if (isInside(mouseX, mouseY, nextButtonRect)) {
      // 判斷是否還有下一題
      if (currentQuestion < quizQuestions.length - 1) {
        // 切換至下一題
        currentQuestion++;
        // 重設點選狀態
        selectedOption = -1;
        // 重設回答狀態
        hasAnswered = false;
      } else {
        // 若已無下一題，設定測驗結束
        isFinished = true;
      }
    }
  }
}

// 輔助函式：判斷座標 (px, py) 是否在矩形 rectObj 範圍內
function isInside(px, py, rectObj) {
  return (
    px >= rectObj.x - rectObj.width / 2 &&
    px <= rectObj.x + rectObj.width / 2 &&
    py >= rectObj.y - rectObj.height / 2 &&
    py <= rectObj.y + rectObj.height / 2
  );
}

// 當使用者調整瀏覽器視窗大小時自動觸發
function windowResized() {
  // 自動將畫布調整為新的視窗全螢幕大小
  resizeCanvas(windowWidth, windowHeight);
}
:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
//學習2程式碼所在

```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
