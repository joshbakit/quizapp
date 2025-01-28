const answerOptions = document.querySelector(".answer_options");
const nextQuestionBtn = document.querySelector(".next_question_btn");
let quizCategory = "programming";
let currentQuestions = null;
const questionsIndexHistory = [];
const questionStatus = document.querySelector(".question_status");
let numberOfQuestions = 5;
const QUIZ_TIME_LIMIT = 10;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
const timerDisplay = document.querySelector(".time_duration");
const resultContainer = document.querySelector(".result_container");
const quizContainer = document.querySelector(".quiz_container");
const resultTitle = document.querySelector(".result_title");
const resultMessage = document.querySelector(".result_message");
let numberOfCorrectAnswer = 0;
const tryAgainBtn = document.querySelector(".try_again_btn");
const configureContainer = document.querySelector(".config_container");
const startQuizBtn = document.querySelector(".start_quiz_btn");
const timerSoundEffect = document.querySelector(".clock_audio");

//countdown timer
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      highLightCorrectAnswer();
      quizContainer.querySelector(".quiz_timer").style.backgroundColor = "#c31402";
      quizContainer.querySelector(".timer_icon").style.animationIterationCount = "0";
      quizContainer.querySelector(".timer_icon").classList.remove("timer_shake");

      timerSoundEffect.pause();
      timerSoundEffect.currentTime = 0;
      
      answerOptions
        .querySelectorAll(".answer_option")
        .forEach((option) => (option.style.pointerEvents = "none"));
      nextQuestionBtn.style.visibility = "visible";
    }
    else if (currentTime <= 5) {
      quizContainer.querySelector(".timer_icon").classList.add("timer_shake");
      if (timerSoundEffect.paused) {
        timerSoundEffect.play().catch(error => console.error("Audio playback failed:", error));
      }
    }
  }, 1000);
};

//reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
  quizContainer.querySelector(".timer_icon").classList.remove("timer_shake");
  timerSoundEffect.pause();
  timerSoundEffect.currentTime = 0;
};

//show quiz result container
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "flex";
  resultMessage.innerHTML = `you answered <b>${numberOfCorrectAnswer}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great
  effort!`;
};

// fetch random question from selected category filter by index history
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];
  if (
    questionsIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestions)
  ) {
    resultTitle.textContent = "Quiz Completed";
    return showQuizResult();
  }
  const availableQuestions = categoryQuestions.filter(
    (_, index) => !questionsIndexHistory.includes(index)
  );
  const randomQuestion =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  console.log(randomQuestion);
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
  console.log(questionsIndexHistory);
};

//highlighting the correct answer
const highLightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer_option")[
      currentQuestions.correctAnswer
    ];
  correctOption.classList.add("correct");

  const iconHTML = `<span class=icon>✔️</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

//handle answer
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestions.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "wrong");
  !isCorrect ? highLightCorrectAnswer() : numberOfCorrectAnswer++;
  const iconHTML = `<span class=icon>${isCorrect ? "✔️" : "❌"}</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);
  answerOptions
    .querySelectorAll(".answer_option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
  quizContainer.querySelector(".timer_icon").classList.remove("timer_shake");
  timerSoundEffect.pause();
  timerSoundEffect.currentTime = 0;
};

// render question to the screen
const renderQuestion = () => {
  quizContainer.querySelector(".timer_icon").style.animationIterationCount = "infinite";
  currentQuestions = getRandomQuestion();
  if (!currentQuestions) {
    return;
  }
  resetTimer();
  startTimer();

  //update question
  document.querySelector(".quiz_question").textContent =
    currentQuestions.question;
     quizContainer.querySelector(".quiz_timer").style.backgroundColor = "#8d99ae";
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> out of <b>${numberOfQuestions}</b> Questions`;

  //update asnwer options
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  currentQuestions.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer_option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
  
};

//next question button
nextQuestionBtn.addEventListener("click", renderQuestion);

const resetQuiz = () => {
  resetTimer();
  numberOfCorrectAnswer = 0;
  questionsIndexHistory.length = 0;
  configureContainer.style.display = "block";
  resultContainer.style.display = "none";
 
};
//try again button4

document
  .querySelectorAll(".category_option, .question_option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });

tryAgainBtn.addEventListener("click", resetQuiz);

const startQuiz = () => {
  configureContainer.style.display = "none";
  quizContainer.style.display = "block";

  quizCategory = configureContainer.querySelector(
    ".category_option.active"
  ).textContent;
  numberOfQuestions = parseInt(
    configureContainer.querySelector(".question_option.active").textContent
  );

  renderQuestion();
};
//start quiz button
startQuizBtn.addEventListener("click", startQuiz);
