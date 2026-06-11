let username = "";
let currentLevel = 1;
let currentQuestionIndex = 0;
let lives = 3;


let timer=60;
let interval;
let score=0;
let difficulty="easy";

/* ================= AUDIO ================= */

const bgMusic = document.getElementById("bg-music");
const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");

/* ================= QUESTIONS ================= */

const questions = {

1: [
{
code: `cout << "Hello World"`,
answer: ";",
hint: "Every statement must end properly in C++",
ai: "Something is missing at the end"
},
{
code: `int x = 5 + 3;\ncout << x;`,
answer: "8",
hint: "Add 5 and 3",
ai: "What is the output?"
},
{
code: `int a = 10;\nint b = 2;\ncout << a / b;`,
answer: "5",
hint: "Division of 10 by 2",
ai: "Simple division"
},
{
code: `int x = 7;\ncout << x * 2;`,
answer: "14",
hint: "Multiply 7 by 2",
ai: "What is printed?"
},
{
code: `int x = 5;\ncout << x - 1;`,
answer: "4",
hint: "Subtract 1 from 5",
ai: "Basic subtraction"
},
{
code: `cout << "C++";`,
answer: "C++",
hint: "Just print string",
ai: "Output the text"
},
{
code: `int x = 10;\ncout << x;`,
answer: "10",
hint: "Print variable value",
ai: "Direct output"
},
{
code: `int x = 3;\ncout << x + x;`,
answer: "6",
hint: "3 + 3",
ai: "Add variable to itself"
},
{
code: `cout << 2 + 2;`,
answer: "4",
hint: "Simple math",
ai: "Addition"
},
{
code: `int x = 1;\ncout << x + 9;`,
answer: "10",
hint: "1 + 9",
ai: "Final output?"
}
],




2: [
{
code: `if(5 < 3) cout << "A" else return false;`,
answer: "false",
hint: "5 is greater than 3",
ai: "Condition check ( output false) "
},
{
code: `for(int i=0;i<3;i++) cout << i;`,
answer: "012",
hint: "Loop prints 012",
ai: "Loop output"
},
{
code: `int x = 10;\nif(x == 10) cout << "Yes";`,
answer: "Yes",
hint: "Condition is true",
ai: "Equality check"
},
{
code: `int x = 3;\nif(x % 2 == 0) cout << "Even";\nelse{ cout<<"Odd"; }`,
answer: "Odd",
hint: "3 is odd",
ai: "Modulo check"
},
{
code: `int x = 5;\nif(x > 10) cout << "A"; else cout << "B";`,
answer: "B",
hint: "5 is not > 10",
ai: "Else case"
},
{
code: `int x = 2;\ncout << x * x;`,
answer: "4",
hint: "Square of 2",
ai: "Multiplication"
},
{
code: `int x = 3;\ncout << x + 10;`,
answer: "13",
hint: "3 + 10",
ai: "Simple math"
},
{
code: `int x = 6;\nif(x < 10) cout << "Low";`,
answer: "Low",
hint: "6 is less than 10",
ai: "Condition true"
},
{
code: `int x = 8;\ncout << x - 3;`,
answer: "5",
hint: "8 - 3",
ai: "Subtraction"
},
{
code: `int x = 1;\ncout << x + x + x;`,
answer: "3",
hint: "1+1+1",
ai: "Repeated addition"
}
],



3: [
{
code: `int a = 10;\nint* p = &a;\ncout << *p;`,
answer: "10",
hint: "Pointer dereference",
ai: "What does *p give?"
},
{
code: `int x = 5;\nint& ref = x;\nref = 20;\ncout << x;`,
answer: "20",
hint: "Reference modifies original",
ai: "Pass by reference"
},
{
code: `int arr[3] = {1,2,3};\ncout << arr[1];`,
answer: "2",
hint: "Index starts from 0",
ai: "Array indexing"
},
{
code: `int arr[3] = {5,10,15};\ncout << *(arr + 2);`,
answer: "15",
hint: "Pointer arithmetic",
ai: "arr+2 means third element"
},
{
code: `int x = 10;\nint* p = &x;\n*p = 99;\ncout << x;`,
answer: "99",
hint: "Pointer changes value",
ai: "Indirect modification"
},
{
code: `for(int i=0;i<3;i++) cout << i << " ";`,
answer: "0 1 2 ",
hint: "Loop prints numbers",
ai: "Loop output"
},
{
code: `int a = 2;\nint b = 3;\ncout << a * b + 1;`,
answer: "7",
hint: "2*3+1",
ai: "Operator priority"
},
{
code: `int arr[4] = {10,20,30,40};\ncout << arr[3];`,
answer: "40",
hint: "Last element",
ai: "Array index"
},
{
code: `int x = 5;\ncout << x++;\n`,
answer: "5",
hint: "Post increment prints old value",
ai: "x++ behavior"
},
{
code: `int x = 5;\ncout << ++x;`,
answer: "6",
hint: "Pre increment increases first",
ai: "++x behavior"
}
]

};

function startGame(){
    username=document.getElementById("username").value.trim() || "Hacker";
    document.getElementById("welcome-screen").classList.remove("active");
    document.getElementById("story-screen").classList.add("active");


    difficulty=document.getElementById("difficulty")?.value || "easy";

    const story = `Hello ${username}...\nYou are trapped in Sector-7.\nFix the corrupted code to unlock the doors and escape before it's too late.`;
  typeWriter(document.getElementById("story-text"), story, 40);


  //voice 

  setTimeout(()=>{
    speakStory(story);
  },800);

  setTimerDifficulty();
};

function setTimerDifficulty(){

    if(currentLevel==1)timer=900;
    if(currentLevel==2)timer=600;
    if(currentLevel==3)timer=300;
}


function speakStory(text){
    if ('speechSynthesis' in window) {
        // Stop any previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Make it sound robotic
        utterance.rate = 0.8;      // Speed
        utterance.pitch = 0.4;      // Lower pitch = more robotic
        utterance.volume = 0.9;

        // Try to use a deeper voice if available
        const voices = window.speechSynthesis.getVoices();
        const roboticVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('microsoft') || 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('guy')
        );
        
        if (roboticVoice) utterance.voice = roboticVoice;

        window.speechSynthesis.speak(utterance);
    }
}



function typeWriter(el,text,speed){
    el.innerHTML="";
    let i=0;
    const timer=setInterval(()=>{
        if(i<text.length){
            el.innerHTML += text.charAt(i) === "\n" ? "<br><br>" : text.charAt(i);
            i++;
        }
        else{
            clearInterval(timer);
        }
    },speed);
}

function startMission(){

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    document.getElementById("story-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    loadQuestion();
    startTimer();
}


function startTimer(){
    clearInterval(interval);

    interval=setInterval(() =>{
        timer--;

        document.getElementById("timer").textContent=formatTime(timer);

        if(timer<=0){
            loseLife();
        }
    },1000);
}


function formatTime(seconds){
    const min= Math.floor(seconds/60);
    const sec=seconds%60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function loseLife(){
    lives--;
    document.getElementById("lives").textContent =
        "❤️ ".repeat(lives);

    if(lives<=0){
        endGame(false);
    }
    else{
        nextQuestion();
    }
}

function updateProgress(){
    const total=questions[currentLevel].length;
    const percent=(currentQuestionIndex/total)*100;

    document.getElementById("progress-bar").style.width=percent + "%";
}

function loadQuestion(){
    const q=questions[currentLevel][currentQuestionIndex];
    
    document.getElementById("level-num").textContent=currentLevel;
    document.getElementById("q-num").textContent=currentQuestionIndex+1;
    document.getElementById("code-display").textContent=q.code;
    document.getElementById("ai-message").textContent=q.ai;

    updateProgress();
}


function showDoorMessage(text, unlocked = false){

    const door = document.getElementById("door-status");

    door.textContent = text;

    door.classList.remove("hidden");

    door.classList.remove("unlocked");

    if(unlocked){
        door.classList.add("unlocked");
    }

    door.classList.add("show");

    setTimeout(()=>{
        door.classList.remove("show");

        door.classList.add("hidden");
    },2000);
}




function submitAnswer(){

    const input =
    document.getElementById("answer-input").value.trim();

    const q =
    questions[currentLevel][currentQuestionIndex];

    if(input.toLowerCase() === q.answer.toLowerCase()){

        score+=10;
        saveGame();
        document.getElementById("score").textContent=score;

        document.getElementById("feedback").innerHTML =
        `<span style="color:#00ff00">✅ ACCESS GRANTED</span>`;

        showDoorMessage("🔓 DOOR UNLOCKED", true);

        setTimeout(()=>{
            nextQuestion();
        },2000);

    }
    else{

        lives--;

        document.getElementById("lives").textContent =
        "❤️ ".repeat(lives);

        document.getElementById("feedback").innerHTML =
        `<span style="color:#ff4444">❌ ACCESS DENIED</span>`;

        showDoorMessage("🔒 ACCESS DENIED");

        document.querySelector(".game-box")
        .classList.add("shake");

        setTimeout(()=>{
            document.querySelector(".game-box")
            .classList.remove("shake");
        },400);

        if(lives <= 0){

            setTimeout(()=>{

                alert("💀 GAME OVER\n\nYou ran out of lives.");

                location.reload();

            },1000);
        }
    }
}


function saveGame(){
    localStorage.setItem("bugHunterSave",JSON.stringify({
        username,

        currentLevel,
        currentQuestionIndex,
        lives,
        score,
        timer,
    }));

    
}
//nextQuestion();
    //submitAnswer();


function loadGame(){
    const data = JSON.parse(localStorage.getItem("bugHunterSave"));

    if(data){
        username=data.username;
        currentLevel=data.currentLevel;
        currentQuestionIndex=data.currentQuestionIndex;
        lives=data.lives;
        score=data.score;
        timer=data.timer;


        document.getElementById("welcome-screen").classList.remove("active");
        document.getElementById("game-screen").classList.add("active");

        loadQuestion();
        startTimer();
    }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions[currentLevel].length) {
    if (currentLevel < 3) {
            alert(`🎉 Level ${currentLevel} Complete! Moving to next level...`);
            currentLevel++;
            currentQuestionIndex = 0;

            setTimerDifficulty();
            startTimer();
        } else {
            endGame(true);
            return;
        }
  }
  document.getElementById("answer-input").value = "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("door-status").classList.remove("unlocked");
  document.getElementById("door-status").textContent = "DOOR LOCKED";
  loadQuestion();
}


function showHint() {
  const q = questions[currentLevel][currentQuestionIndex];
  alert("💡 Hint: " + q.hint);
}


function endGame(win){
    clearInterval(interval);

    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("end-screen").classList.add("active");

    document.getElementById("end-title").textContent =
    win ? "🎉 YOU ESCAPED!" : "💀 GAME OVER";

    document.getElementById("final-score").textContent =
    "Score: " + score;

    let high = localStorage.getItem("highScore") || 0;

    if(score > high){
        localStorage.setItem("highScore", score);
        high = score;
    }

    document.getElementById("high-score").textContent =
        "High Score: " + high;
    
    clearInterval(interval);

}

function restartGame(){
    localStorage.removeItem("bugHunterSave");
    location.reload();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcome-screen").classList.add("active");
});

document.addEventListener("DOMContentLoaded", loadGame);