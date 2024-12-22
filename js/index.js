let amount = document.querySelector("#amount");
let buttonPrev = document.querySelector("#Prev");
let buttonNext = document.querySelector("#Next");
let quizSection = document.querySelector(".quiz");
let home = document.querySelector(".home");
let selected = "";
let difficulty = "";
let start = 0;
let score = 0;
let questionData = [];
let arrCollectionNumAnswerAndIds = [];
document.querySelector("#difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
});

document.querySelector("#selected").addEventListener("change", (e) => {
  selected = e.target.value;
});

document.querySelector("#btn").addEventListener("click", (e) => {
  if (amount.value < 50) {
    getData(
      `https://opentdb.com/api.php?amount=${amount.value}&category=${selected}&difficulty=${difficulty}&type=multiple`
    );
  }
});

function assign(questionDataP) {
  questionData = questionDataP;
}
async function getData(url) {
  const resData = await fetch(`${url}`);
  const { results } = await resData.json();
  quizSection.classList.replace("d-none", "d-block");
  home.classList.replace("d-block", "d-none");
  assign(results);
  display(questionData[0], 0);
  console.log(questionData);
}

function display(questionObj, id) {
  let ans = [];
  ans = [...questionObj.incorrect_answers, questionObj.correct_answer].sort();
  let blackBox = `<p data-numQu=${id} class="num-qu w-50">Number Questions : <span>${
    questionData.length
  }</span></p>
              <p class="num-qu">Current Questions : <span>${start + 1}</span></p>
              <h2 id="question" class="mt-3 text-start">${questionObj?.question}</h2>
              <ul class="my-3 py-3" id="options">
                <li  data-num=0 class='${questionObj.num == 0 ? "active" : ""}'><span>${
    ans[0]
  }</span></li>
                <li data-num=1 class='${questionObj.num == 1 ? "active" : ""}'><span>${
    ans[1]
  }</span></li>
                <li data-num=2 class='${questionObj.num == 2 ? "active" : ""}'><span>${
    ans[2]
  }</span></li>
                <li data-num=3 class='${questionObj.num == 3 ? "active" : ""}'><span>${
    ans[3]
  }</span></li>
              </ul>`;

  document.querySelector(".showQ").innerHTML = blackBox;
  const lis = document.querySelectorAll("#options li");
  document.querySelector("#options").addEventListener("click", (e) => {
    lis.forEach((e) => {
      e.classList.remove("active");
    });
 // Stop Here
    if (e.target.textContent == questionObj.correct_answer) {
      const foundObject = arrCollectionNumAnswerAndIds.find(
        (obj) => obj.id === e.target.dataset.numQu && obj.answer === e.target.textContent
      );
      if (!foundObject) {
        arrCollectionNumAnswerAndIds.push({
          id: e.target.dataset.numQu,
          answer: e.target.textContent,
        });
      }
      console.log(arrCollectionNumAnswerAndIds);
    } else {
      const foundObject = arrCollectionNumAnswerAndIds.find(
        (obj) => obj.id === e.target.dataset.numQu
      );
      console.log(foundObject);
      if (foundObject) {
        console.log('dd')
        arrCollectionNumAnswerAndIds = arrCollectionNumAnswerAndIds.filter((e) => {
          return e.id != foundObject.id;
        });
      }
    }
    console.log(arrCollectionNumAnswerAndIds);
// /Stop
    if (e.target.tagName == "SPAN") {
      e.target.parentElement.classList.add("active");
      questionObj["num"] = e.target.parentElement.dataset.num;
    } else if (e.target.tagName == "LI") {
      e.target.classList.add("active");
      questionObj["num"] = e.target.dataset.num;
    }
  });
}

buttonNext.addEventListener("click", (e) => {
  if (start < questionData.length - 1) {
    start++;
    display(questionData[start], start);
    buttonPrev.classList.remove("opacity-50-cursor");
  } else {
    buttonNext.classList.add("opacity-50-cursor");
  }
});
buttonPrev.addEventListener("click", (e) => {
  if (start > 0) {
    start--;
    display(questionData[start], start);
    buttonNext.classList.remove("opacity-50-cursor");
  } else {
    buttonPrev.classList.add("opacity-50-cursor");
  }
});

/*
category
: 
"Science &amp; Nature"
correct_answer
: 
"False"
difficulty
: 
"medium"
incorrect_answers
: 
['True']
question
: 
"Sugar contains fat."
type
: 
"boolean"



category
: 
"Geography"
correct_answer
: 
"Lake Superior "
difficulty
: 
"hard"
incorrect_answers
: 
(3) ['Caspian Sea', 'Lake Michigan', 'Lake Huron']
question
: 
"Which is the largest freshwater lake in the world?"
type
: 
"multiple"
*/
