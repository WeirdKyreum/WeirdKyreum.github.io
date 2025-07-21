// const aField = document.querySelector("#aField");
// const bField = document.querySelector("#bField");
// const sumBox = document.querySelector("#sum-box");
// const sumButton = document.querySelector("#sum");
// sumButton.addEventListener("click", doSum);
// function doSum() {
// //.value is property to get data from input element
// //parseInt to convert into number
// let a = parseInt(aField.value);
// let b = parseInt(bField.value);
// let sum = a+b;
// sumBox.innerHTML = "Sum of "+a+" and "+b+" is " + sum +".";
// }


// var min=0, max=100, currGuess=-100, counter=0;
// var ans=Math.round(Math.random()*(max-min)+min);
// console.log("Ans:"+ans);
// const btnGuess=document.querySelector("#btnGuess");
// const guessField=document.querySelector("#guessField");
// const smallerlbl=document.querySelector("#smaller");
// const biggerlbl=document.querySelector("#bigger");
// const commentsBox=document.querySelector("#commentsBox");
// btnGuess.addEventListener("click",GuessFn);

// function GuessFn(){
// currGuess=parseInt(guessField.value);
// console.log("Curr Guess:"+currGuess);
// let comments="";
// if(currGuess==ans){
// comments="CORRECT!";
// }
// if(currGuess>ans){
// //replace the right number with current guess
// biggerlbl.innerHTML=currGuess;
// comments="too Big!";
// }
// if(currGuess<ans){
// //replace the left number with current guess
// smallerlbl.innerHTML=currGuess;
// comments="too Small!";
// }
// guessField.value="";
// counter++;
// //commentsBox.innerHTML="Your guess: "+currGuess+" is "+comments+”;
// Tries:"+counter";
// //use template literals (backticks)
// commentsBox.innerHTML=`Your guess: ${currGuess} is ${comments} Tries:
// ${counter}`;
// }

const btnSubmit = document.querySelector("#btnSubmit");
const scorebox = document.querySelector("#scorebox");

var q1, q2, score = 0;

function CheckAns() {
    // read the value of the selected radio button for q1
    q1 = document.querySelector("input[name='q1']:checked").value;
    console.log(q1); // check q1 value retrieved

    // read the value of the selected radio button for q2
    q2 = document.querySelector("input[name='q2']:checked").value;
    console.log(q2); // check q2 value retrieved

    // reset score to 0, check answers, and give score if correct
    score = 0;
    if (q1 == "Tokyo") score++;
    if (q2 == "Red") score++;

    scorebox.innerHTML = "Score: " + score;
}

arrayAns=["Tokyo","Red"];
for (let i = 1; i < 3; i++ ){
    CheckAns()
}



btnSubmit.addEventListener("click", CheckAns);
