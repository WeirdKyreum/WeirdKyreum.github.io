
function GetRandom(min, max) {
    //this will select a number between min and max
    return Math.round(Math.random() * (max - min)) + min;
}
function MoveDurian() {
    durianId.style.left = GetRandom(0, 500) + "px";
    durianId.style.top = GetRandom(0, 500) + "px";
    durianId.classList.add("anim1");
    durianId.classList.remove("shrink");
}

var moveDurianItvId = setInterval(MoveDurian, 2000);
const stopBtn=document.querySelector("#stopBtn");
stopBtn.addEventListener("click",function(){
    clearTimeout(moveDurianItvId);
    stopBtn.classList.toggle("newState");
    stopBtn.classList.add("anim1");
})

const scoreBox = document.getElementById("scoreBox");

const popAudio = new Audio("");
//create an new Audio Object using sound file

var score = 0;    //to track how many clicks
function durianCatch() {
    //increases score after clicking
    score++;
    //update html scorebox
    scoreBox.innerHTML = "Score: " + score;
    popAudio.play(); //play the audio!

    //make durian shrink and fade!
    durianId.classList.add("shrink");
    //undo durian rotate animation
    durianId.classList.remove("anim1");
}
//link durian to mouseclick to durianCatch function
durianId.addEventListener("click", durianCatch);

//keyevents to test durian transition and anmiation works
document.addEventListener("keydown", function (evt) {
    console.log(evt);
    if (evt.code == "KeyT") {
        durianId.classList.add("shrink");
    }
    if (evt.code == "KeyU") {
        durianId.classList.remove("shrink");
    }
    if (evt.code == "KeyA") {
        durianId.classList.add("anim1");
    }
    if (evt.code == "KeyB") {
        durianId.classList.remove("anim1");
    }
});
