
const btn = document.querySelector('#valid');
const divMain= document.querySelector('.container');
const spanQuestion = document.querySelector('#question');
const divHistory=document.querySelector('#history')
const numInput=document.querySelector('#num');
const denInput=document.querySelector('#den');
const signInput=document.querySelector('#sign');
const labelSign=document.querySelector('label');
const divQuestion=document.querySelector('#current')
const opacityWrapper=document.querySelector('#opacityWrapper');
const divPartial=document.querySelector('#partial')
const divCompleted=document.querySelector('#completed')
const solutions=document.querySelector('#solutions');
const h1Title=document.querySelector('h1');
//const previousLink=document.querySelector('#previous');
const nextLink=document.querySelector('#next');
const circle=document.querySelector('#svgProgressBar circle:nth-child(2)');
const circleAround=document.querySelector('#svgProgressBar circle:nth-child(1)');
const counter=document.querySelector('#counter');
const divCompletedExercise=document.querySelector('#completedExercise');
const btnRestart=document.querySelector('#restart');
const divTutorial=document.querySelector('#tutorial');
const btnMenu = document.querySelector('#btnMenu');
const btnCarte = document.querySelector('#btnCarte');
const divButtons = document.querySelector('#buttons');

const divTimer = document.querySelector('#countDown');
const circleTimer = document.querySelector('#svgCountDown circle'); 
const hourGlass= document.querySelector('#hourglass');
const divCompletedSpeed=document.querySelector('#completedSpeed');
const spanSpeedRecord=document.querySelector('#speedRecord');
const spanSpeedRecordNew=document.querySelector('#speedRecordNew');

const skullBtn= document.querySelector('#skull');
const skullCrossBtn= document.querySelector('#skullCrossbones');

const divMenu=document.querySelector('.containerMenu');

// ---- Defining Exercises objects and methods to generate random questions ------
class fixedExercise {
    constructor(id,title,idButton,previous,next,parents,questions,list){
        this.id=id;
        this.title=title;
        this.idButton=idButton;
        this.previous=previous;
        this.next=next;
        this.parents=parents;
        this.questions=questions;
        this.status=0;
        list.push(this);
    }
    
    generateQuestions(){
        return this.questions;
    };
    
    generateMessages(){
        return [];
    };
}

class tutorialExercise {
    constructor(id,title,idButton,previous,next,parents,questions,messages,list){
        this.id=id;
        this.title=title;
        this.idButton=idButton;
        this.previous=previous;
        this.next=next;
        this.parents=parents;
        this.questions=questions;
        this.messages=messages;
        this.status=0;
        list.push(this);
    }
    
    generateQuestions(){
        return this.questions;
    };
    
    generateMessages(){
        return this.messages;
    };
}

class randomExercise {
    constructor(id,title,idButton,previous,next,parents,size,type,depth,min,max,oneAttempt,fiveInRow,timer,list){
        this.id=id;
        this.title=title;
        this.idButton=idButton;
        this.previous=previous;
        this.next=next;
        this.parents=parents;
        this.status=0;
        this.size=size;
        this.type=type;
        this.depth=depth,
        this.min=min;
        this.max=max;
        this.oneAttempt=oneAttempt;
        this.fiveInRow=fiveInRow;
        this.timer=timer;
        list.push(this);
    }
    
    generateQuestions(){
        let questions=[];
        for (let i=0;i<this.size;i++){
            let question =  getRandomQuestion(this.min,this.max,this.depth,this.type);
            while (this.depth===0 && isAlreadySimplified(question)){
                question = getRandomQuestion(this.min,this.max,this.depth,this.type);
            }
            questions.push(question);
        }
        return questions;
    };
    
    generateMessages(){
        return [];
    };
}

function getRandomInt(min,max,zeroNotAllowed) {
    min = Math.ceil(min);
    max = Math.floor(max);
    n= Math.floor(Math.random() * (max - min + 1)) + min;
    if (zeroNotAllowed && n===0) {return getRandomInt(min,max,zeroNotAllowed);}
    else {return n;}
}

function getRandomFraction(min,max,zeroNotAllowed,alreadySimplified) {
    let n;
    if (zeroNotAllowed) {n= getRandomInt(min,max,true);}
    else {n=getRandomInt(min,max,false);}
    
    let d=getRandomInt(min,max,true);
    
    let fraction=math.fraction(math.abs(n),math.abs(d));
    
    if (alreadySimplified===false && fraction.n === math.abs(n)) {return getRandomFraction(min,max,zeroNotAllowed,alreadySimplified);}
    else {return n +'/' +d;}
    
}

function getRandomOperator(){
    return ['+','-','*','/'][getRandomInt(0,3,false)];
}


function getRandomQuestion(min,max,depth,type){
    if (depth===0) {return getRandomFraction(min,max,false,false);}
    else if (depth===1) {
        let n;
        if (type==='/') {return '('+ getRandomFraction(min,max,false,true) + ')' + type + '(' +  getRandomFraction(min,max,true,true) + ')';}         
        else {return '('+ getRandomFraction(min,max,false,true) + ')' + type + '(' +  getRandomFraction(min,max,false,true) + ')';}
    }
    else if (depth===2){
        let mainOp=getRandomOperator();
        let frac1=getRandomQuestion(min,max,1,getRandomOperator());
        let frac2=getRandomQuestion(min,max,1,getRandomOperator());
        if (mainOp==='/' && math.evaluate(frac2)===0) {frac2=getRandomQuestion(min,max,1,getRandomOperator());}
        return '(' +frac1+ ')' + mainOp + '(' + frac2 +  ')';
    }
    else if (depth===1.5){
        let randomDepth=getRandomInt(0,2,false);
        let minBis=-99;
        let maxBis=99;
        if (randomDepth===1) {minBis=-15; maxBis=15;}
        if (randomDepth===2) {minBis=-7; maxBis=7;}
        return getRandomQuestion(minBis,maxBis,randomDepth,getRandomOperator());
    }
}

function isAlreadySimplified(question) {
    return false;
}

let listExercises=[];

let introduction = new tutorialExercise(
    0,'Prise en main','#priseEnMain',null, 1,[],
    ['2/4',
    '8/16',
    '-3/9',
    '9/(-3)',
    '(2-2)/5',
    '-3/-5'],
    ['Essayez de simplifier la fraction suivante en proposant un numérateur et un dénominateur, puis appuyez sur Valider.',
    'Bravo ! La solution est toujours une fraction irréductible. Essayez par exemple de proposer \\( \\frac{4}{8} \\), puis simplifiez complètement.',
    'Parfait ! Les fractions ont aussi un signe, que l\'on peut changer en appuyant sur \\(+\\) ou \\(-\\). Le numérateur et le dénominateur sont toujours positifs.',
    'Très bien ! Dans le cas où le résultat est un nombre entier, on peut laisser le dénominateur vide (ou bien le mettre à 1).',
    'Dans le cas où le résultat est nul, le signe et le dénominateurs sont arbitraires.',
    'Enfin, lorsqu\'une fraction est déjà sous sa forme irréductible, il suffit de proposer la même fraction comme solution.',
    'Félicitations ! Vous savez tout ce qu\'il faut pour continuer. A vous de jouer maintenant...'],
    listExercises
);

let simplify= new randomExercise(
    1,'Simplifier','#simplifier',0,2,[0],5,'+',0,-20,20,false,false,0,listExercises
);

let additiontuto = new fixedExercise(
    2,'Additionner','#plusTuto',1,3,[1],
    ['1/3+1/3',
     '1/3+5/3',
    '1/4+2/4',
     '1/4+1/2',
    '2/3+1/9',
    '1/2+1/3',
    '5/4+2/3'],
    listExercises
);

let additions = new randomExercise(
    3,'Additions','#plus',2,4,[2],5,'+',1,0,10,false,false,0,listExercises
);

let soustractiontuto = new fixedExercise(
    4,'Soustraire','#minusTuto',3,5,[1],
    ['2/3+(-1)/3',
     '2/3-1/3',
    '1/2-2/3',
     '- 1/4+1/6',
    '-1/5 - 1/2'],
    listExercises
);

let soustractions = new randomExercise(
    5,'Soustractions','#minus',4,6,[4],5,'-',1,-10,10,false,false,0,listExercises
);

let multiplicationtuto = new fixedExercise(
    6,'Multiplier','#timesTuto',5,7,[1],
    ['2/3*3',
     '3*(4/5)',
    '2/5*(3/7)',
     '2/3*(5/4)',
    '2/7*(-1/3)',
    '4/(-3)*(5/2)',
    '(-3)/2*(3/-2)'],
    listExercises
);

let multiplications= new randomExercise(
    7,'Multiplications','#times',6,8,[6],5,'*',1,-10,10,false,false,0,listExercises
);

let divisiontuto = new fixedExercise(
    8,'Diviser','#divideTuto',7,9,[1],
    ['(2/3)/2',
     '(2/3)*(1/3)',
    '(2/3)/3',
     '(4/5)*(3/7)',
    '(4/5)/(7/3)',
    '(3/2)/(5/4)',
    '(2/9)/(-3/4)'],
    listExercises
);

let divisions = new randomExercise(
    9,'Divisions','#divide',8,10,[8],5,'/',1,-10,10,false,false,0,listExercises
);

let combinaisons = new randomExercise(
    10,'Mélange','#melange',9,11,[3,5,7,9],5,'/',2,-5,5,false,false,0,listExercises
);

let firstAttempt = new randomExercise(
    11,'Du premier coup','#firstAttempt',10,12,[10],5,'/',1.5,-7,7,true,false,0,listExercises
);

let fiveInRow = new randomExercise(
    12,'Cinq à la suite','#fiveInRow',11,13,[11],5,'/',1.5,-7,7,false,true,0,listExercises
);

let withTimer = new randomExercise(
    13,'Vitesse','#withTimer',12,14,[12],5,'/',1.5,-7,7,false,true,90,listExercises
);
/*let exercise1 = new fixedExercise(
    1,'Test',0, 1,
    ['1/2-3/5',
    '-2+4*(1/2)',
    '2*(5/7)+3/(1+1/2)',
    '(1/4+6/2)/(7/4+3/2)',
    '1+4/(1+1/4)',
    '(1/2+1/3)*(2/3-5)'],
    listExercises
);

let exercise2 = new fixedExercise(
    2,'Deuxième exercice',0, 2,
    ['1/4+3/7',
    '7/2*(6/8+9/2)',
    '(2/3+1)/(1-2/3)',
    '(3/12+4)*(9/4+2)',
    '1/(1+1/(4+2))'],
    listExercises
);

let exercise3 = new fixedExercise(
    3,'Troisième exercice',1, null,
    ['1+1/2',
    '5*2/3',
    '15-5/4',
    '37/2+1',
    '9/5+1/6'],
    listExercises
);*/


// Initialization 

let idExercise;
let question;
let exerciseLenght=1;
let messages=[];

let unfinishedExercise=false;

// Timer Initialization
let startTime = null;
let rAF;

//For debugging: is the answer is always correct?
autovalid=false; 


// Main loop
btn.addEventListener('click',function(event){
   event.preventDefault(); 
    
   //denInput.style.backgroundColor='#8ecae6';
    
   if (denInput.value==='') {
       denInput.value=1;
   }
    
   if (denInput.value==='0') {
       denInput.style.backgroundColor='red';
       return false;
   }
    
   let answer=math.fraction(math.evaluate(exercise[i]));
    
    if (listExercises[idExercise].timer>0){
        startTime=null;
        cancelAnimationFrame(rAF);
    }
    
   if (checkAnswer(exercise,i,answer)===1) {
       btn.disabled=true;
       btn.style.backgroundColor='#6CAE75';
       raiseInput();
       setTimeout(()=>{
            i++;
            //updateProgressBar();
            opacityWrapper.style.opacity=0;
            setTimeout(()=> {
                updateHistory(question,answer,true)
                //counter.textContent=i+'/'+exerciseLenght; //  '\\( \\frac{'+ i +'}{'+ exerciseLenght + '}\\)'; 
                MathJax.typeset([document.querySelector('p')]);
                setTimeout(()=>{
                    if (i===exercise.length){
                        listExercises[idExercise].status=1;
                        localStorage.setItem('Status Exercise '+idExercise,'completed');
                        opacityWrapper.style.opacity=0;
                        btn.disabled=true;
                        //btn.classList.remove('validateButton');
                        //btn.classList.add('validateButtonDisabled')
                        divButtons.style.opacity=0;
                        divTutorial.textContent=messages[i];
                        unfinishedExercise=false;
                        setTimeout(()=>{
                            divButtons.style.display='none';
                            opacityWrapper.style.display='none';
                            if(listExercises[idExercise].timer>0){
                                spanSpeedRecord.textContent=totalTime;
                                if(totalTime>10){totalTime-=10;}
                                spanSpeedRecordNew.textContent=totalTime;
                                localStorage.setItem('Countdown',totalTime);
                                divCompletedSpeed.style.display='block';
                            }
                            else {
                                divCompletedExercise.style.display='block';
                            }                         
                            divCompleted.style.display='flex';
                            setTimeout(()=>{divCompleted.style.opacity=1;},300);
                        },500);
                        nextLink.style.visibility="visible";
                        //if (idExercise>0) {previousLink.style.visibility="visible";}           
                        //else {previousLink.style.visibility="hidden";}  
                        //if (idExercise<listExercises.length-1) {nextLink.style.visibility="visible";}           
                        //else {nextLink.style.visibility="hidden";}  
                    }
                    else {
                        question=showQuestion(exercise,i);
                        spanQuestion.classList.remove('fade-in-text');  
                        btn.disabled=false;
                    }
                    resetInput();       
                    MathJax.typeset(document.querySelectorAll('#question, #tutorial')) 
                    if (i<exercise.length){opacityWrapper.style.opacity=1;}
                },600);
            },600);           
       },350);
   }
   else if (checkAnswer(exercise,i,answer)===2) {
       btn.style.backgroundColor='#FFB703';//'orange'; 
       divPartial.classList.add('popDiv');
       divPartial.textContent = '\\( =' + printPartial() + '\\)';
       divPartial.style.display='block';
       MathJax.typeset(document.querySelectorAll('#partial'))
       setTimeout(()=> {divPartial.classList.remove('popDiv');},1000);
   }    
   else {
       btn.style.backgroundColor='red'
       btn.classList.add('shakeButton');
       setTimeout(()=> {btn.classList.remove('shakeButton');},1000);  

       if (listExercises[idExercise].oneAttempt===true) {
           raiseInput();
           setTimeout(()=>{opacityWrapper.style.opacity=0;},500);
           setTimeout(()=>{
               updateHistory(question,answer,false)
               exercise[i]=getRandomQuestion(0,0,1.5,'')
               question=showQuestion(exercise,i);
               spanQuestion.classList.remove('fade-in-text');                
               MathJax.typeset(document.querySelectorAll('#question'));
               MathJax.typeset([document.querySelector('p')]); 
               opacityWrapper.style.opacity=1;
               resetInput();
               },1000);
       }
       
       if (listExercises[idExercise].fiveInRow===true) {
            raiseInput();
            if (i>0) {circleAround.style.stroke='red';}
            setTimeout(()=>{opacityWrapper.style.opacity=0;},500);
            setTimeout(()=>{
                initializeExercise(idExercise);
                MathJax.typeset(document.querySelectorAll('#question')); 
                },1500);
       }
   }
       
});

/*previousLink.addEventListener('click',function(event){
        previousLink.disabled=true;
        event.preventDefault();
        divCompleted.style.opacity=0;
        idExercise--;
        h1Title.style.opacity=0;
        divCompletedExercise.style.display='none';
        divButtons.style.display='flex';
        setTimeout(()=>{
            divCompleted.style.display='none';
            initializeExercise(idExercise)
            MathJax.typeset()
            previousLink.disabled=true;
        }       
        ,650); 
});*/

nextLink.addEventListener('click',function(event){
        nextLink.disabled=true;
        event.preventDefault();
        divMain.style.display='none'; 
        divMap.style.display='block';
        setTimeout(updateMap,100);  
        //window.addEventListener('resize', connectAll);
        /*divCompleted.style.opacity=0;
        h1Title.style.opacity=0;
        divCompletedExercise.style.display='none';
        divButtons.style.display='flex';
        divCompleted.style.display='none';*/
        nextLink.disabled=false;    
});

btnRestart.addEventListener('click',function(event){
        event.preventDefault();
        divCompletedExercise.style.display='none';
        divCompleted.style.opacity=0;
        divCompletedSpeed.style.display='none';
        setTimeout(()=>{
            divCompleted.style.display='none';
            divButtons.style.display='flex';
            setTimeout(()=>{divButtons.style.opacity=1;},500);
        },500);
        initializeExercise(idExercise)
        MathJax.typeset(document.querySelectorAll('#question'));        
});

numInput.addEventListener('keydown',function(e){
    if (e.key === 'ArrowUp'){
        e.preventDefault();
    }
    else if (e.key === 'ArrowDown' || e.key==='/'){
        e.preventDefault();
        denInput.focus();
    }
    });

                          

denInput.addEventListener('keydown',function(e){
    if (e.key === 'ArrowUp'){        
        e.preventDefault()
        numInput.focus();
    }
    else if (e.key === 'ArrowDown'){
        e.preventDefault();        
    }
    });


denInput.addEventListener('focus',function(){
    denInput.style.backgroundColor='#8ecae6';
    });

window.addEventListener('keydown',function(e){
    if (e.key==='+'){
        e.preventDefault();
        signInput.checked=false;
    }
    else if (e.key==='-'){
        e.preventDefault();
        signInput.checked=true;
    }
});


btnMenu.addEventListener('click',function(e){
    e.preventDefault();
    divMenu.style.display='block';
    divMain.style.display='none';    
})

btnCarte.addEventListener('click',function(e){
    e.preventDefault();
    divMain.style.display='none'; 
    divMap.style.display='block';
    setTimeout(updateMap,100);  
    //window.addEventListener('resize', connectAll);
    //connectAll()       
})




function loadExercise(j){
    let currentExercise=listExercises[j];
    let exercise=currentExercise.generateQuestions(); 
    messages=currentExercise.generateMessages();
    h1Title.textContent=currentExercise.title;
    if (currentExercise.constructor===randomExercise){
        let icon=document.createElement('i');
        icon.classList.add('fa', 'fa-random');
        h1Title.textContent += ' ';
        h1Title.appendChild(icon);
    }
    if (currentExercise.constructor===tutorialExercise){
        divTutorial.style.display='block';
        divHistory.style.height='40%';
    }
    else {
        divTutorial.style.display='none';
        divHistory.style.height='45%';
    }
    setTimeout(()=>{h1Title.style.opacity=1;},100);
    divQuestion.style.display='flex';
    opacityWrapper.style.display='flex';
    setTimeout(()=>{
        opacityWrapper.style.opacity=1;
        setTimeout(()=>{
            counter.style.opacity=1;
            circle.style.strokeDasharray='0, 500';
            circleAround.style.stroke='#306BAC'
            updateProgressBar();
            },500);
        },500);    
    return exercise;
}


function showQuestion(exercise,i){
    while (divPartial.firstChild) {
          divPartial.removeChild(divPartial.lastChild);
    }
    while (spanQuestion.firstChild) {
          spanQuestion.removeChild(spanQuestion.lastChild);
    }
    divPartial.textContent = '';
    divPartial.style.display='none';
    let questionTree=math.parse(exercise[i]);
    let question;
    /*let operator=questionTree.op;
    if (checkLongQuestion(questionTree)){            
        let one = questionTree.args[0];
        let two = questionTree.args[1];
        one=one.toTex({parenthesis: 'auto'}); 
        two=two.toTex({parenthesis: 'auto'});
        if (operator==='*'){operator ='\\times';}
        operator = ' ' + operator + ' ';
        question='\\(' + one + '\\)\\(' + operator + two + '\\)'; 
        }
    else {        
    }*/
    question=questionTree.toTex({parenthesis: 'auto'});   
    counter.textContent=(i+1)+'/'+exerciseLenght; //  '\\( \\frac{'+ i +'}{'+ exerciseLenght + '}\\)'; 
    spanQuestion.textContent='\\(' + question + '\\)'; 
    if(i!=0){updateProgressBar();} 
    divTutorial.textContent=messages[i]; 
    if (listExercises[idExercise].timer>0){
        circleTimer.style.stroke='';
        hourGlass.style.color='';
        rAF=requestAnimationFrame(countDown);
    }
    return question;
}

/*function checkBrekableOp(op){
    if (op==='+' || op==='-' || op==='*') {return true;}
    else {return false;}
}

function checkLongQuestion(tree){
    if (tree.op !== '/' && checkBrekableOp(tree.args[0].content.op) && checkBrekableOp(tree.args[1].content.op)) {
        return true;
        }
    else {return false;}
}*/


function checkAnswer(exercice,i,answer){
    if (autovalid===true) {return 1;}
    let num=Number(numInput.value);
    let den=Number(denInput.value);
    let sign=1;
    if (signInput.checked) {sign=-1;}
    
    if (answer.n===0 && num===0){return 1;}        
    else if(sign===answer.s && num===answer.n && den===answer.d){return 1;}
    else if(math.fraction(sign*num,den)-answer===0){return 2;}
    else {return 0;}
}

function updateHistory(question,answer,correct){
    let p = document.createElement('p');
    p.textContent= '\\(' + question + ' = ' + printFraction(answer) + '\\)';
    let validCheck=document.createElement('span');
    if (correct===true){        
        validCheck.className='validCheck';
        validCheck.textContent='✓';
    }
    else {
        validCheck.className='unvalidCheck';
        validCheck.textContent='❌';
    }
    p.appendChild(validCheck);
    divHistory.prepend(p);
    p.classList.add('fade-in-text2');
    //p.scrollIntoView();
}

function clearHistory(){
    while (divHistory.firstChild) {
          divHistory.removeChild(divHistory.lastChild);
    }
    numInput.value='';
    denInput.value='';
    signInput.checked=false;
}

function initializeExercise(id){
    clearHistory();
    MathJax.typesetClear(divMain);
    // Dealing with countdown
    if (listExercises[id].timer>0){
        divTimer.style.display='block';
        divButtons.style.justifyContent='space-around';
        if (localStorage.getItem('Countdown')!==null){
            totalTime=Number(localStorage.getItem('Countdown'));
        }
        else {totalTime=listExercises[id].timer;}
    }
    else {
        divTimer.style.display='none';
        divButtons.style.justifyContent='';
        startTime=null;
        cancelAnimationFrame(rAF);
    }
    //Decorating Validate Button
    if (listExercises[id].oneAttempt===true){
        skullBtn.style.display='inline';
        skullCrossBtn.style.display='none';
    }
    else if (listExercises[id].fiveInRow===true){
        skullBtn.style.display='none';
        skullCrossBtn.style.display='inline';
    }
    else {
        skullBtn.style.display='none';
        skullCrossBtn.style.display='none';
    }
    exercise=loadExercise(id);
    unfinishedExercise=true;
    i=0;//exercise.length-1;
    exerciseLenght=exercise.length;
    question=showQuestion(exercise,i);
    resetInput();
    btn.disabled=false;
    //btn.classList.remove('validateButtonDisabled');
    //btn.classList.add('validateButton');
    //showSolutions(exercise);
}

function resetExerciseContainer() {
   divCompleted.style.opacity=0;
   h1Title.style.opacity=0;
   divCompletedExercise.style.display='none';
   divButtons.style.display='flex';
   divButtons.style.opacity=1;
   opacityWrapper.style.opacity=0;
   divCompleted.style.display='none';
   divCompletedSpeed.style.display='none';
   counter.textContent='';
}

function printFraction(fraction) {
    let result='';
    if (fraction.n===0) {
        result='0';
    }
    else {
        if (fraction.s===-1){
            result='-';
        }
        if (fraction.d===1){
            result=result + fraction.n
        }
        else {
            result = result + '\\frac\{'+ fraction.n +'\}\{'+ fraction.d + '\}';
        }
    }
   
    return result;
}

function printPartial(){
    let num=numInput.value;
    let den=denInput.value;
    let sign='';
    if (signInput.checked) {sign='-';}
    let result= sign + '\\frac\{' + num + '\}\{' + den +'\}';
    return result;
}

function raiseInput() {
       numInput.style.boxShadow='none';
       numInput.style.backgroundColor='#CDE8F4';
       denInput.style.backgroundColor='#CDE8F4';
       denInput.style.boxShadow='none';
       labelSign.style.boxShadow='none';
       labelSign.style.backgroundColor='#CDE8F4';
}

function resetInput() {
       btn.style.backgroundColor=''; 
       numInput.style.boxShadow='';
       denInput.style.boxShadow=''; 
       numInput.style.backgroundColor='';
       denInput.style.backgroundColor='';
       labelSign.style.boxShadow='';
       labelSign.style.backgroundColor='';
       numInput.value='';
       denInput.value='';
       signInput.checked=false;
       numInput.focus(); 
}

function updateProgressBar(){
      r=Number(circle.attributes.r.value);
      let dashArray='';
      let separator=3;
      let dashPattern=r*Math.PI*2/exerciseLenght-separator
      let k=i+1;
      for (let j=0; j<k;j++){
          if (j===k-1) {dashArray= dashArray + dashPattern +',' + 500; }
          else {dashArray= dashArray + dashPattern +',' + separator + ','; }                  
      }
      circle.style.strokeDasharray=dashArray;
      return dashArray;
}

//make the sign buttun flip like a coin

/* This function is not used becaused it is in conflicts with parenthesis... instead I have replaced \cdot by \times directly in the source code of Math.js
function customLaTeX(node, options) {
  if ((node.type === 'OperatorNode') && (node.fn === 'multiply')) {
    //don't forget to pass the options to the toTex functions
    return node.args[0].toTex(options) + ' \\times ' + node.args[1].toTex(options)
  }
}*/

function showSolutions(exercise) {
    while (solutions.firstChild) {
          solutions.removeChild(solutions.lastChild);
    }
    for (let i=0; i<exercise.length; i++){
        let questionBis=math.parse(exercise[i]);
        let displayQuestion=questionBis.toTex({parenthesis:'auto'});
        let answer=math.fraction(math.evaluate(exercise[i]));
        let p = document.createElement('p');
        p.textContent='\\(' + displayQuestion + ' = ' + printFraction(answer) + '\\)';
        solutions.appendChild(p);
    }  
}
/* ------  Menu buttons ---- */

const btnStart=document.querySelector('#start');

const btnErase=document.querySelector('#erase');
const btnEraseStorage=document.querySelector('#confirmErase');
const divErasingTerminated=document.querySelector('#erasingTerminated');

const btnOffline=document.querySelector('#offline');
const btnShortcuts=document.querySelector('#shortcuts');
const btnAbout=document.querySelector('#about');



btnStart.addEventListener('click',function(e){
    e.preventDefault();
    resetMenuTextBox()
    divMenu.style.display='none';
    divMap.style.display='block';
    btnStart.textContent='Reprendre';
    setTimeout(updateMap,100);  
    //window.addEventListener('resize', connectAll);
    numInput.focus(); 
})

btnErase.addEventListener('click',function(e){
    e.preventDefault();
    resetMenuTextBox()
    showDiv('#eraseText');
})

btnOffline.addEventListener('click',function(e){
    e.preventDefault();
    resetMenuTextBox()
    showDiv('#offlineText');
})

btnShortcuts.addEventListener('click',function(e){
    e.preventDefault();
    resetMenuTextBox()
    showDiv('#shortcutsText');
})

btnAbout.addEventListener('click',function(e){
    e.preventDefault();
    resetMenuTextBox()
    showDiv('#aboutText');
})

function showDiv(id){
    let div = document.querySelector(id);
    div.classList.remove('hiddenTextBox');
    div.scrollIntoView();
}

function resetMenuTextBox(){
    for (let div of document.querySelectorAll('.menuTextBox div')){
        div.classList.add('hiddenTextBox');
    }
    divErasingTerminated.style.opacity='0';
}

/* ----- Map script ------- */

const divMap=document.querySelector('.containerMap');

const btnMapToMenu=document.querySelector('#btnMaptoMenu');
const btnMapToMain=document.querySelector('#btnMaptoMain');

divMap.addEventListener('scroll', connectAll);
window.addEventListener('resize', ()=>{
    if (divMap.style.display==='block'){connectAll();}
});

btnMaptoMenu.addEventListener('click',function(e){
    e.preventDefault();
    divMenu.style.display='block';
    divMap.style.display='none';  
    //window.removeEventListener('resize',connectAll)
})

btnMaptoMain.addEventListener('click',function(e){
    e.preventDefault();
    divMain.style.display='block';
    divMap.style.display='none'; 
    //window.removeEventListener('resize',connectAll)
})

/*const btnPriseEnMain=document.querySelector('#priseEnMain');
const btnSimplifier=document.querySelector('#simplifier');

const btnPlusTuto=document.querySelector('#plusTuto');
const btnMinusTuto=document.querySelector('#minusTuto');
const btnTimesTuto=document.querySelector('#timesTuto');
const btnDivideTuto=document.querySelector('#divideTuto');

const btnPlus=document.querySelector('#plus');
const btnMinus=document.querySelector('#minus');
const btnTimes=document.querySelector('#times');
const btnDivide=document.querySelector('#divide');*/

let btnMelange=document.querySelector('#melange');

let svgMap = document.querySelector('#svgMap');
//let line = document.querySelector('line');

class btnNode {
    constructor(id,idExo,parents,children){
        this.id=id;
        this.idExo=idExo;
        this.parents=parents;
        this.children=children;
    }    
}

class btnGraph {
    constructor (){
        this.nodes=[];
    }
    
    addBtnNode(id,idExo,parents) {
        let node=new btnNode(id,idExo,parents,[])
        for (const otherNode of this.nodes){
            if (node.parents.indexOf(otherNode.id)>-1) {
                otherNode.children.push(node.id);
            }
        }
        this.nodes.push(node);
    }
}

let buttonGraph = new btnGraph();

buttonGraph.addBtnNode('#priseEnMain',0,[]);
buttonGraph.addBtnNode('#simplifier',1,['#priseEnMain']);
buttonGraph.addBtnNode('#plusTuto',2,['#simplifier']);
buttonGraph.addBtnNode('#minusTuto',4,['#simplifier']);
buttonGraph.addBtnNode('#timesTuto',6,['#simplifier']);
buttonGraph.addBtnNode('#divideTuto',8,['#simplifier']);
buttonGraph.addBtnNode('#plus',3,['#plusTuto']);
buttonGraph.addBtnNode('#minus',5,['#minusTuto']);
buttonGraph.addBtnNode('#times',7,['#timesTuto']);
buttonGraph.addBtnNode('#divide',9,['#divideTuto']);
buttonGraph.addBtnNode('#melange',10,['#plus','#minus','#times','#divide']);
buttonGraph.addBtnNode('#firstAttempt',11,['#melange']);
buttonGraph.addBtnNode('#fiveInRow',12,['#firstAttempt']);
buttonGraph.addBtnNode('#withTimer',13,['#fiveInRow']);



function connectElements(btn1,btn2,resize) {
    if (btn1.disabled===false && btn2.disabled===false) {
        let pos1 = btn1.getBoundingClientRect();
        let pos2 = btn2.getBoundingClientRect();
        let startx = pos1.x + pos1.width/2;
        let starty = pos1.y + pos1.height/2;
        let endx = pos2.x + pos2.width/2;
        let endy = pos2.y + pos2.height/2;

        /*line.style.x1=startx;
        line.style.y1=starty;
        line.style.x2=endx;
        line.style.y1=endy;*/

        let line=document.createElementNS('http://www.w3.org/2000/svg','line');
        line.classList.add('mapLine');
        line.setAttribute('x1',startx);
        line.setAttribute('y1',starty)
        line.setAttribute('x2',endx);
        line.setAttribute('y2',endy);
        line.setAttribute('stroke','black');
        svgMap.appendChild(line);
        if (resize===true) {line.style.strokeDasharray='500';}
        else {setTimeout(()=>{line.style.strokeDasharray='500';},800);}
    }
}

function connectAll() {
    while (svgMap.firstChild) {
          svgMap.removeChild(svgMap.lastChild);
    }
    
    for (const node of buttonGraph.nodes){
        let btnbis=document.querySelector(node.id);
            if (btnbis.classList.contains('achievedBtnMap')===true){
                for (const idChild of node.children){
                    let btnter= document.querySelector(idChild);
                    connectElements(btnbis,btnter,true);
                }
            }
    }
}

function updateMap() {
    let updated=false;
    closeAlertMap();
    if (idExercise>-1){btnMapToMain.style.display='block';}
    else {btnMapToMain.style.display='none';}
    
    while(document.querySelector('.currentBtnMap')){
        document.querySelector('.currentBtnMap').classList.remove('currentBtnMap');
    }
    for (const node of buttonGraph.nodes){
        let btnbis=document.querySelector(node.id);
        let exo = listExercises[node.idExo];
        
        if (btnbis.classList.contains('hiddenBtnMap')===true && node.parents.length===0) {// First top button 
            updated=true;
            btnbis.classList.remove('hiddenBtnMap');
            btnbis.style.opacity=1;
            btnbis.disabled=false;
            btnbis.addEventListener('click',function(e){
                    e.preventDefault();
                    idExercise=node.idExo;
                    if (unfinishedExercise===true) {openAlertMap(idExercise);}
                    else { 
                        resetExerciseContainer();
                        divMap.style.display='none';
                        divMain.style.display='block';
                        //window.removeEventListener('resize',connectAll)
                        initializeExercise(idExercise)
                        MathJax.typeset(document.querySelectorAll('#question'));
                    }
            });
        }   
        
        if (btnbis.disabled===false && btnbis.classList.contains('achievedBtnMap')===false && exo.status===1) {
            updated=true;
            btnbis.classList.add('achievedBtnMap');
            btnbis.style.backgroundColor='#306BAC';
            let hrId = node.id + ' hr';
            let hrBtnBis=document.querySelector(hrId);
            if (hrBtnBis !== null) {hrBtnBis.classList.add('hrBtnMapAchieved');}
            for (const idChild of node.children){
                let btnter= document.querySelector(idChild);
                btnter.classList.remove('hiddenBtnMap');
                btnter.style.opacity=1;
                btnter.disabled=false;
                connectElements(btnbis,btnter,false);
                //if (storageUpdated===true){connectElements(btnbis,btnter,false);}
                btnter.addEventListener('click',function(e){
                        e.preventDefault();
                        idExercise=findIdExercise(idChild);
                        if (unfinishedExercise===true) {openAlertMap(idExercise);}
                        else { 
                            resetExerciseContainer();
                            divMap.style.display='none';
                            divMain.style.display='block';
                            //window.removeEventListener('resize',connectAll)
                            initializeExercise(idExercise)
                            MathJax.typeset(document.querySelectorAll('#question'));
                        }
                });
            }
        }
        
        if (node.idExo===idExercise) {btnbis.classList.add('currentBtnMap');}

    }
    if (updated===false) {connectAll();}
    //if (storageUpdated==false) {setTimeout(connectAll,1300);}
    storageUpdated=true;
}

function findIdExercise(buttonId) {
            for (const exo of listExercises){
                if (exo.idButton===buttonId) {return exo.id;}
            }
        }

const crossAlertMap = document.querySelector('#crossAlertMap');
const divAlertMap = document.querySelector('#alertMap');
const btnConfirmSwitch = document.querySelector('#confirmSwitch');

crossAlertMap.addEventListener('click',closeAlertMap);

function closeAlertMap(){
    divAlertMap.classList.remove('popDiv');
    divAlertMap.style.display='none';    
}

function openAlertMap(idExercise){
    divAlertMap.classList.add('popDiv');
    divAlertMap.style.display='block';
    btnConfirmSwitch.addEventListener('click',function(e){
        e.preventDefault();
        closeAlertMap();
        resetExerciseContainer();
        divMap.style.display='none';
        divMain.style.display='block';
        //window.removeEventListener('resize',connectAll)
        initializeExercise(idExercise)
        MathJax.typeset(document.querySelectorAll('#question'));   
    });
}

/* ----- Local data storage ------- */
let storageUpdated=false;

if (localStorage.getItem('Status Exercise 0')=== 'completed'){
    updateMap();
    listExercises[0].status=1;
    for (let i=1; i<listExercises.length;i++){
        if (localStorage.getItem('Status Exercise '+i)=== 'completed'){
        listExercises[i].status=1;
        }
    }
}

else {//In the case where there is no storage.
    storageUpdated=true;
    btnStart.textContent='Commencer';
} 



btnEraseStorage.addEventListener('click',()=>{
    localStorage.clear();
    btnStart.textContent='Commencer';
    document.querySelector('#eraseText').classList.add('hiddenTextBox');
    divErasingTerminated.classList.remove('hiddenTextBox');
    setTimeout(()=>{divErasingTerminated.style.opacity=1;},100);
    idExercise=undefined;
    btnMapToMain.style.display='none';
    resetExerciseContainer();
    unfinishedExercise=false;
    resetStatus();
    resetMap(); 
    closeAlertMap(); // There seems to be a problem with the alert box poping after erasing storage
});

function resetStatus(){
    for (let i=0; i<listExercises.length;i++){
        listExercises[i].status=0;
    }
}

function resetMap(){
    while (svgMap.firstChild) {
          svgMap.removeChild(svgMap.lastChild);
    }
    for (const node of buttonGraph.nodes){
        let btnbis=document.querySelector(node.id);
        btnbis.disabled=true;
        btnbis.style.backgroundColor='';
        btnbis.classList.remove('achievedBtnMap');
        btnbis.classList.add('hiddenBtnMap');
        btnbis.style.opacity='';
    }
}


// --- Timer Count Down ----
let r=Number(circle.attributes.r.value);  
let perim=r*Math.PI*2;
function arcCircle(x){
   circleTimer.style.strokeDasharray=x*perim/100 + ' 500';
}

let totalTime; //Countdown time in seconds

function countDown(timestamp){
    if (!startTime) {
      startTime = timestamp;
    }

    currentTime = timestamp - startTime;
    percent=100-currentTime/(totalTime*1000)*100;
    
    if (Math.round(percent)===25){
        circleTimer.style.stroke='#FB8500';
        hourGlass.style.color='#FB8500';
    }
    
    arcCircle(percent);
    
    if (percent<0){
        hourGlass.style.color='red';
        startTime=null;
        cancelAnimationFrame(rAF);
        btn.click();
    }
    else {
    rAF=requestAnimationFrame(countDown);
    }
}

