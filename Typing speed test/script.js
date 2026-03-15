let passageText=""
let timer=0
let interval

const passage=document.getElementById("passage")
const input=document.getElementById("input")

const time=document.getElementById("time")
const wpm=document.getElementById("wpm")
const accuracy=document.getElementById("accuracy")
const message=document.getElementById("message")

const difficulty=document.getElementById("difficulty")
const mode=document.getElementById("mode")

let best=localStorage.getItem("bestWPM") || 0


async function loadPassage(){

let res=await fetch("data.json")
let data=await res.json()

let level=difficulty.value

let passages=data[level]

passageText=passages[Math.floor(Math.random()*passages.length)]

passage.innerHTML=""

passageText.split("").forEach(char=>{

let span=document.createElement("span")
span.innerText=char
passage.appendChild(span)

})

}


function startTest(){

input.value=""
input.focus()

timer= mode.value==="time" ? 60 : 0

time.innerText=timer

interval=setInterval(()=>{

if(mode.value==="time"){

timer--
time.innerText=timer

if(timer<=0){

finishTest()

}

}else{

timer++
time.innerText=timer

}

},1000)

}


function finishTest(){

clearInterval(interval)

let currentWPM=parseInt(wpm.innerText)

if(best==0){

message.innerText="Baseline Established!"
best=currentWPM
localStorage.setItem("bestWPM",best)

}else if(currentWPM>best){

message.innerText="High Score Smashed!"
best=currentWPM
localStorage.setItem("bestWPM",best)

}else{

message.innerText="Best WPM: "+best

}

}


input.addEventListener("input",()=>{

let chars=passage.querySelectorAll("span")
let typed=input.value.split("")

let correct=0

chars.forEach((char,index)=>{

if(typed[index]==null){

char.classList.remove("correct","wrong")

}else if(typed[index]==char.innerText){

char.classList.add("correct")
char.classList.remove("wrong")
correct++

}else{

char.classList.add("wrong")
char.classList.remove("correct")

}

})

let words=input.value.length/5

let wpmValue=Math.round(words/(timer||1)*60)

wpm.innerText=wpmValue||0

let acc=Math.round((correct/typed.length)*100)

accuracy.innerText=acc||100

})


document.getElementById("start").onclick=()=>{

message.innerText=""
startTest()

}

document.getElementById("restart").onclick=()=>{

clearInterval(interval)
message.innerText=""
loadPassage()
input.value=""
wpm.innerText=0
accuracy.innerText=100

}


loadPassage()