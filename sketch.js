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