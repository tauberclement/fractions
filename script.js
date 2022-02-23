/*
Copyright or © or Copr. Clément Tauber (18.02.2022)

clement.tauber@math.unistra.fr

This software is a computer program whose purpose is to help students 
to practice on exercices about mathematical fractions.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 

As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 

In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.
*/


const btn = document.querySelector('#valid');
const divMain= document.querySelector('.container');
const divMainWrapper =document.querySelector('.mainWrapper');
const spanQuestion = document.querySelector('#question');
const divHistory=document.querySelector('#history')
const numInput=document.querySelector('#num');
const denInput=document.querySelector('#den');
const signInput=document.querySelector('#sign');
const labelSign=document.querySelector('.labelSign');
const hrFraction=document.querySelector('.hrFraction')
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
const divAlertMain=document.querySelector('#alertMain');
const spanSpeedRecordAlert=document.querySelector('#speedRecordAlert');
const spanActualSpeedAlert=document.querySelector('#actualSpeedAlert');
const btnMoreTime=document.querySelector('#moreTime');
const btnNoMoreTime=document.querySelector('#noMoreTime');


const skullBtn= document.querySelector('#skull');
const skullCrossBtn= document.querySelector('#skullCrossbones');

const divMenu=document.querySelector('.containerMenu');

const divFinished=document.querySelector('#finished');

const divDraft=document.querySelector('#draft');
const btnDraft=document.querySelector('#draftIcon');

// ---- Defining Exercises objects and methods to generate random questions ------
class fixedExercise {
    constructor(id,title,idButton,previous,next,parents,questions,xvariable,list){
        this.id=id;
        this.title=title;
        this.idButton=idButton;
        this.previous=previous;
        this.next=next;
        this.parents=parents;
        this.questions=questions;
        this.status=0;
        this.xvariable=xvariable;
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
    constructor(id,title,idButton,previous,next,parents,questions,messages,xvariable,list){
        this.id=id;
        this.title=title;
        this.idButton=idButton;
        this.previous=previous;
        this.next=next;
        this.parents=parents;
        this.questions=questions;
        this.messages=messages;
        this.xvariable=xvariable;
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
    constructor(id,title,idButton,previous,next,parents,size,type,depth,min,max,oneAttempt,fiveInRow,timer,xvariable,list){
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
        this.xvariable=xvariable;
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

function getRandomPolynomial(min,max,zeroNotAllowed){
    let a=getRandomInt(min,max,false);
    return [a,getRandomInt(min,max,a===0 && zeroNotAllowed)];
}

function getRandomRationalFraction(min,max){
    return [getRandomPolynomial(min,max,false),getRandomPolynomial(min,max,true)];
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
        if (type==='xvar'){
            return [mainOp,getRandomRationalFraction(min,max),getRandomRationalFraction(min,max)];
        }
        else {
            let frac1=getRandomQuestion(min,max,1,getRandomOperator());
            let frac2=getRandomQuestion(min,max,1,getRandomOperator());
            if (mainOp==='/' && math.evaluate(frac2)===0) {return getRandomQuestion(min,max,2,'/');}
            
            return '(' +frac1+ ')' + mainOp + '(' + frac2 +  ')';
        }
        
        
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
    false,
    listExercises
);

let simplify= new randomExercise(
    1,'Simplifier','#simplifier',0,2,[0],5,'+',0,-20,20,false,false,0,false,listExercises
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
    false,
    listExercises
);

let additions = new randomExercise(
    3,'Additions','#plus',2,4,[2],5,'+',1,0,10,false,false,0,false,listExercises
);

let soustractiontuto = new fixedExercise(
    4,'Soustraire','#minusTuto',3,5,[1],
    ['2/3+(-1)/3',
     '2/3-1/3',
    '1/2-2/3',
     '- 1/4+1/6',
    '-1/5 - 1/2'],
    false,
    listExercises
);

let soustractions = new randomExercise(
    5,'Soustractions','#minus',4,6,[4],5,'-',1,-10,10,false,false,0,false,listExercises
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
    false,
    listExercises
);

let multiplications= new randomExercise(
    7,'Multiplications','#times',6,8,[6],5,'*',1,-10,10,false,false,0,false,listExercises
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
    false,
    listExercises
);

let divisions = new randomExercise(
    9,'Divisions','#divide',8,10,[8],5,'/',1,-10,10,false,false,0,false,listExercises
);

let combinaisons = new randomExercise(
    10,'Mélange','#melange',9,11,[3,5,7,9],5,'/',2,-5,5,false,false,0,false,listExercises
);

let firstAttempt = new randomExercise(
    11,'Du premier coup','#firstAttempt',10,12,[10],5,'/',1.5,-7,7,true,false,0,false,listExercises
);

let fiveInRow = new randomExercise(
    12,'Cinq à la suite','#fiveInRow',11,13,[11],5,'/',1.5,-7,7,false,true,0,false,listExercises
);

let withTimer = new randomExercise(
    13,'Vitesse','#withTimer',12,14,[12],5,'/',1.5,-7,7,false,true,90,false,listExercises
);

let xvariableIntro = new tutorialExercise(
    14,'Fractions rationnelles','#xvar',13, 15,[10],
    [['+', [[0,1],[2,0]], [[1,0],[2,0]] ],      //'(x/2 + 1/2)',
     ['+', [[-2,3],[1,1]], [[3,-1],[1,1]] ],    //'(3x-2)/(x+1) + (-x+3)/(x+1)',
     ['+', [[1,0],[1,0]], [[1,0],[0,2]] ],      //'1 + 1/(2x)',
     ['-', [[0,1],[1,1]], [[1,0],[-1,1]] ],     //'x/(x+1)-1/(x-1)',
     ['+', [[2,0],[3,3]], [[0,1],[1,1]] ],      //'x/(2x+1)+3/(x+3)',
     ['*', [[1,1],[-1,1]], [[0,2],[-2,1]] ],    //'((x+1)/(x-1))*(2x/(x-2))',
     ['/', [[0,3],[2,1]], [[2,2],[4,2]] ]],     //'(3x/(x+2))/((2x+2)/(x+2))'],*/
    ['Pour cette série d\'exercices, \\( x \\) est une variable réelle.',
    '',
    '',
    'Pour écrire \\(x^2, x^3,\\ldots\\) appuyez sur ^ puis 2,3,... Proposez des expressions totalement factorisées ou totalement développées.',
    'Pensez à simplifier au maximum chaque fraction rationnelle, la réponse est toujours une forme irréductible.',
    'Vous pouvez utiliser la notation implicite pour la multiplication, ou bien le symbole *.',
    ''],
    true,
    listExercises
);

let xvarPractice = new randomExercise(
    15,'Entrainement','#xvarPractice',14,16,[14],9,'xvar',2,-5,5,false,false,0,true,listExercises
);

let xvarTimer = new randomExercise(
    16,'Difficulté maximale','#xvarWithTimer',15,17,[15],5,'xvar',2,-7,7,false,true,120,true,listExercises
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
let idExerciseBackup;//To fix a bug
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
       
   if (numInput.value==='') {
       numInput.value=0;
   }    
    
   if (denInput.value==='') {
       denInput.value=1;
   }
    
   if (denInput.value==='0') {
       denInput.style.backgroundColor='#EF233C';
       return false;
   }
    
    
   let answer;
    if (listExercises[idExercise].xvariable===true){
        answer=solveRationalQuestions(exercise[i]);
    }
    else {
        answer=math.fraction(math.evaluate(exercise[i]));
    }
   
    
   if (checkAnswer(exercise,i,answer)===1) {
       btn.disabled=true;
       btn.style.backgroundColor='#6CAE75';
       raiseInput();
       cancelAnimationFrame(rAF);
       divDraft.value='';
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
                            divDraft.style.display='';
                            if(listExercises[idExercise].timer>0){
                                spanSpeedRecord.textContent=printTime(totalTime);
                                localStorage.setItem('Countdown Record ' + idExercise,totalTime);
                                lowerTimer();
                                spanSpeedRecordNew.textContent=printTime(totalTime);
                                localStorage.setItem('Countdown ' + idExercise,totalTime);
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
   else {//The anwser is wrong
       btn.style.backgroundColor='#EF233C';//'#CC2836'
       btn.classList.add('shakeButton');
       cancelAnimationFrame(rAF);
       setTimeout(()=> {btn.classList.remove('shakeButton');},1000);  

       if (listExercises[idExercise].oneAttempt===true) {
           raiseInput();
           divDraft.value='';
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
       
       else if (listExercises[idExercise].fiveInRow===true) {
            raiseInput();
            if (i>0) {circleAround.style.stroke='#EF233C';}
            setTimeout(()=>{opacityWrapper.style.opacity=0;},500);
            setTimeout(()=>{
                initializeExercise(idExercise);
                MathJax.typeset(document.querySelectorAll('#question')); 
                },1500);
       }
       
       if (listExercises[idExercise].timer>0 && almostNoTime===true) {
           if (localStorage.getItem('Countdown Record ' + idExercise)===null){
               increaseTimer();
               localStorage.setItem('Countdown ' + idExercise,totalTime);
           }
           else {
               attemptsWithTimer +=1;
               if (attemptsWithTimer===3) {
               attemptsWithTimer=0;
               openAlertMain();       
               }                 
           }
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

btnDraft.addEventListener('click',function(event){
        event.preventDefault();
        if (divDraft.style.display==='block'){divDraft.style.display='';}
        else {
            divDraft.style.display='block'; divDraft.select();}
});

//Somehow clearing all timeout reduces javascript heap, even though they are all finished
function cleanTimeouts(){
    let highestId = window.setTimeout(() => {
            for (let i = highestId; i >= 0; i--) {
                window.clearInterval(i);
            }
    }, 0);
}

nextLink.addEventListener('click',function(event){
        nextLink.disabled=true;
        cleanTimeouts();
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
        cleanTimeouts();
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

let powerUpdated=false;

numInput.addEventListener('keydown',function(e){
    if (e.key === 'ArrowUp'){
        e.preventDefault();
    }
    else if (e.key === 'ArrowDown' || e.key==='/'){
        e.preventDefault();
        denInput.focus();
    }
});

function unicodeDigit(i){
    if (i==='2' || i==='3') {return String.fromCharCode('0xB'+i);}
    else if (i==='1') {return '\u00B9';}
    else {return String.fromCharCode('0x207'+i);}
}


numInput.addEventListener('compositionend', (event) => {
    if (numInput.getAttribute('type')==='text'){
        if (event.data[0]==='^' && isFinite(event.data[1])){
            event.preventDefault();
            numInput.value=numInput.value.slice(0,numInput.selectionStart-2) + unicodeDigit(event.data[1]) + numInput.value.slice(numInput.selectionStart);
        }
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

denInput.addEventListener('compositionend', (event) => {
    if (denInput.getAttribute('type')==='text'){
        if (event.data[0]==='^' && isFinite(event.data[1])){
            event.preventDefault();
            denInput.value=denInput.value.slice(0,denInput.selectionStart-2) + unicodeDigit(event.data[1]) + denInput.value.slice(denInput.selectionStart);
        }
    }
});

divDraft.addEventListener('compositionend', (event) => {
        if (event.data[0]==='^' && isFinite(event.data[1])){
            event.preventDefault();
            divDraft.value=divDraft.value.slice(0,divDraft.selectionStart-2) + unicodeDigit(event.data[1]) + divDraft.value.slice(divDraft.selectionStart);
        }
});

denInput.addEventListener('focus',function(){
    denInput.style.backgroundColor='#8ecae6';
    });

window.addEventListener('keydown',function(e){
    if (listExercises[idExercise]!==undefined && listExercises[idExercise].xvariable!==true && divDraft.matches(':focus')===false){
        if (e.key==='+'){
            e.preventDefault();
            signInput.checked=false;
        }
        else if (e.key==='-'){
            e.preventDefault();
            signInput.checked=true;
        }
    }
    
    if (e.key==='b' && divDraft.style.display==='block'){
        e.preventDefault();
        divDraft.style.display='';
    }
    
    else if (e.key==='b' && divDraft.style.display===''){
        e.preventDefault();
        divDraft.style.display='block';
        divDraft.select();
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
        icon.classList.add('fas', 'fa-random');
        h1Title.textContent += ' ';
        h1Title.appendChild(icon);
    }
    /*if (currentExercise.constructor===tutorialExercise){
        divTutorial.style.display='block';
        divHistory.style.height='40%';
    }
    else {
        divTutorial.style.display='none';
        divHistory.style.height='45%';
    }*/
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
    let questionTree;
    
    if (listExercises[idExercise].xvariable===true){
        questionTree = math.parse('(' + printRationalFraction(exercise[i][1]) + ')' + exercise[i][0] + '('+ printRationalFraction(exercise[i][2])+ ')');
    }
    else {
        questionTree=math.parse(exercise[i]);        
    }
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
       
    let question=questionTree.toTex({parenthesis: 'auto'});
    counter.textContent=(i+1)+'/'+exerciseLenght; //  '\\( \\frac{'+ i +'}{'+ exerciseLenght + '}\\)'; 
    spanQuestion.textContent='\\(' + question + '\\)'; 
    if(i!=0){updateProgressBar();} 
    divTutorial.textContent=messages[i];
    MathJax.typeset([divTutorial]);
    if (listExercises[idExercise].timer>0){
        circleTimer.style.stroke='';
        hourGlass.style.color='';
        almostNoTime=false;
        startTime=null;
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
    
    if (listExercises[idExercise].xvariable===true){
        let num=math.parse(exponentToHat(numInput.value)).transform(correctNode).transform(correctNode2);
        let den=math.parse(exponentToHat(denInput.value)).transform(correctNode).transform(correctNode2);
        
        let numRationalized=math.rationalize(num).toString().replace(/\s/g, '');
        let denRationalized=math.rationalize(den).toString().replace(/\s/g, '');
        
        let negNum=math.rationalize(negNode(num)).toString().replace(/\s/g, '');
        let negDen=math.rationalize(negNode(den)).toString().replace(/\s/g, '');
        
        //let negNum=math.rationalize(new math.OperatorNode('-','unaryMinus',[new math.ParenthesisNode(num)])).toString().replace(/\s/g, '');
        //let negDen=math.rationalize(new math.OperatorNode('-','unaryMinus',[new math.ParenthesisNode(den)])).toString().replace(/\s/g, '');
        
        let numAnswer=math.rationalize(answer[0]).toString().replace(/\s/g, '');
        let denAnswer=math.rationalize(answer[1]).toString().replace(/\s/g, '');
        
        if ((numRationalized===numAnswer && denRationalized===denAnswer) || (negNum===numAnswer && negDen===denAnswer)) {
            if (testCanonicalForm(num) && testCanonicalForm(den)) {return 1;}
            else {return 2;}
        }
        
        else {
            let simplified=simplifyRatFrac(numRationalized,denRationalized);
            if ((simplified[0]===numAnswer.replaceAll('*','') && simplified[1]===denAnswer.replaceAll('*','')) || (simplified[2]===numAnswer.replaceAll('*','') && simplified[3]===denAnswer.replaceAll('*',''))){return 2;}
            else {return 0;}
        }
    }
    
    else {
        let num=Number(numInput.value);
        let den=Number(denInput.value);
        let sign=1;
        if (signInput.checked) {sign=-1;}
        if (answer.n===0 && num===0){return 1;}        
        else if(sign===answer.s && num===answer.n && den===answer.d){return 1;}
        else if(math.fraction(sign*num,den)-answer===0){return 2;}
        else {return 0;}
    }
}

function exponentToHat(str){
    for (let i=0; i<10;i++){
        if (i===2 || i===3) {str=str.replaceAll(String.fromCharCode('0xB'+i),'^'+i);}
        else if (i===1) {str=str.replaceAll('\u00B9','');}
        else if (i===0) {
            str=str.replaceAll('x\u2070','1');
            str=str.replaceAll('\u2070','^0');
        }
        else {str=str.replaceAll(String.fromCharCode('0x207'+i),'^'+i);}
    }
    return str;
}

function negNode(node){
    return new math.OperatorNode('*','multiply',[new math.ConstantNode(-1),node],true);
}

function simplifyRatFrac(numString,denString){    
    let numP=new Polynomial(numString);
    let denP=new Polynomial(denString);
    let gN=gcdCoeffsPoly(numP);
    let gD=gcdCoeffsPoly(denP);
    if (gN>1 && gD>1){
        let f=math.fraction(gN,gD);
        numP=numP.mul(f.n/gN);
        denP=denP.mul(f.d/gD);
    }
    let G=numP.gcd(denP);
    let nG=G.mul(-1);
    return [numP.div(G).toString(),denP.div(G).toString(),numP.div(nG).toString(),denP.div(nG).toString()];
}

let nc;
let nx;
let nx2;

function testCanonicalForm(node){
    if (node.type==='ParenthesisNode'){return testCanonicalForm(node.content);}
    else if (node.fn==='unaryMinus'){return testCanonicalForm(node.args[0]);}
    else if (node.op==='*'){return testCanonicalForm(node.args[0]) && testCanonicalForm(node.args[1])}
    else {return testCanonicalPolynom(node);}
}

function testCanonicalPolynom(node){
    nc=0;
    nx=0;
    nx2=0;
    node.traverse(countConstant);
    node.traverse(countPowers1);
    node.traverse(countPowers2);
    if (nc<=1 && nx<=1 && nx2<=1){return true;}
    else {return false;}
}


function countConstant(node,path,parent){
    if (node.type==='ConstantNode' && parent===null){nc++;}
    else if (node.type==='ConstantNode' && (parent.op==='+' || parent.op==='-')){nc++;}
}


function countPowers1(node,path,parent){
    if (node.name==='x' && parent===null){nx++;}
    else if (node.name==='x' && parent.op!=='^'){nx++;}
}


function countPowers2(node,path,parent){
    if (node.op==='^' && node.args[0].name==='x' && node.args[1].value===2){nx2++;}
}



function updateHistory(question,answer,correct){
    let p = document.createElement('p');
    let frac;
    if (listExercises[idExercise].xvariable===true) {
        if (answer[1].value===1){frac=answer[0].toTex({parenthesis:'auto'});}
        else {
            answerTree=new math.OperatorNode('/','divide',[answer[0],answer[1]]);
            frac=answerTree.toTex({parenthesis:'auto'});
        }
    }
    else {frac=printFraction(answer,false);}
    p.textContent= '\\(' + question + ' = ' + frac + '\\)';
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

//For rational fracions, the expressions x(x-a) ar interpreted as a function x of the variable x-a. This functions corrects the problem
function correctNode(node,path,parent){
    if (node.type==='FunctionNode'){
        //return new math.OperatorNode('*','multiply',[new math.ParenthesisNode(new math.OperatorNode('*','multiply',[new math.ConstantNode(1),new math.SymbolNode('x')])),node.args[0]],true);
        return new math.OperatorNode('*','multiply',[new math.SymbolNode('x'),node.args[0]],true);
    }
    else {return node;}
}

function correctNode2(node,path,parent){
    if (node.fn==='unaryMinus'){
        return new math.OperatorNode('*','multiply',[new math.ConstantNode('-1'),node.args[0]],true);
    }
    else {return node;}
}

// Remove the space in implicit multiplication
function customImplicit(node,options){
    if (node.op==='*' && node.implicit===true && node.args[1].type==='SymbolNode'){
        return node.args[0].toTex(options) + node.args[1].toTex(options);
    }
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
    idExerciseBackup=id;
    // Dealing with countdown
    if (listExercises[id].timer>0){
        divTimer.style.display='block';
        divButtons.style.justifyContent='space-around';
        if (localStorage.getItem('Countdown ' + idExercise)!==null){
            totalTime=Number(localStorage.getItem('Countdown ' + idExercise));
        }
        else {totalTime=listExercises[id].timer;}
    }
    else {
        divTimer.style.display='none';
        divButtons.style.justifyContent='';
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
    if (listExercises[id].xvariable===true){
        labelSign.style.display='none'; 
        hrFraction.classList.add('hrLong');
        numInput.setAttribute('type','text');
        denInput.setAttribute('type','text');
    }
    else {
        labelSign.style.display=''; 
        hrFraction.classList.remove('hrLong');
        numInput.setAttribute('type','number');
        denInput.setAttribute('type','number');
    }
    divDraft.style.display='';
    divDraft.value='Brouillon...'
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

function printFraction(fraction,xvar) {
    let result='';
    if (xvar===false){
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
    }
    
    else {
        result=math.parse(fraction).toTex({parenthesis:'auto',implicit:'hide'});
    }
   
    return result;
}

function printPartial(){
    let num=numInput.value;
    let den=denInput.value;
    let sign='';
    if (listExercises[idExercise].xvariable===false && signInput.checked) {sign='-';}
    else {
        num=exponentToHat(num);
        den=exponentToHat(den);
    }
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

function printRationalFraction(ratFrac){
    let poly1=new Polynomial(ratFrac[0]);
    let poly2=new Polynomial(ratFrac[1]);
    if (poly2.degree()===0 && poly2.lc()===1) {return poly1.toString();}
    else {return '('+ poly1.toString() +')/('+  poly2.toString() +')';}
}

function factorPolynom(poly){
    let g=math.gcd(poly[0],poly[1])
    if (g===0) {return [0,[poly[0],poly[1]]];}
    else if (poly[1]>0 || (poly[1]===0 && poly[0]>0)) {return [g,[poly[0]/g,poly[1]/g]];}
    else {return [-g,[-poly[0]/g,-poly[1]/g]];}
}

/*function auxUndefined(i){
    if (i===undefined){return 0;}
    else {return i;}
}*/

function simplifyRationalFraction(ratFrac){
    let poly1f=factorPolynom(ratFrac[0]);
    let poly2f=factorPolynom(ratFrac[1]);
    if (poly1f[1][0]===poly2f[1][0]&&poly1f[1][1]===poly2f[1][1]){return [math.fraction(poly1f[0],poly2f[0]),[1,0],[1,0]];}
    else {return [math.fraction(poly1f[0],poly2f[0]),poly1f[1],poly2f[1]];}
}

function polyToString(poly){
    if (poly.degree()===0 && poly.lc()===1){return '';}
    else if (poly.degree()===0 && poly.lc()===-1){return '-';}
    else {return poly.toString();}
}

function coeffToString(coeff){
    if (coeff===1){return '';}
    else if (coeff===-1) {return '-';}
    else {return coeff.toString();}
}

function polySize(poly){
    let size=0;
    for (let i=0;i<3;i++){
        if (isFinite(poly.coeff[i])) {size=size+1;}
    }
    return size;
}

function gcdCoeffsPoly(poly){
    let coeffs=[];
    for (let i=0;i<=poly.degree();i++){
        if(isFinite(poly.coeff[i])){coeffs.push(poly.coeff[i]);}
    }
    if(coeffs.length>1){return math.gcd.apply(this,coeffs);}
    else {return poly.lc();}        
} 

function allCoeffsAreNegative(poly){
    for (let i=0;i<=poly.degree();i++){
        if(poly.coeff[i]>0){return false;}
    }
    return true;
}

function addRationalFractions(ratFrac1,ratFrac2){
    let rFrac1=simplifyRationalFraction(ratFrac1);
    let rFrac2=simplifyRationalFraction(ratFrac2);
    let frac1=rFrac1[0];
    let frac2=rFrac2[0];
    let num1=new Polynomial(rFrac1[1]);
    let num2=new Polynomial(rFrac2[1]);
    let den0;
    let den1=new Polynomial(rFrac1[2]);
    let den2;
    let newNum;
    let newNumString;
    
    // Case where one fraction is zero
    if (rFrac1[1][0]===0 && rFrac1[1][1]===0) {
        newNum=num2.mul(frac2.s*frac2.n);
        den1=new Polynomial('1');
        rFrac1[2]=[1,0];
        den2=new Polynomial(rFrac2[2]);
        den0=frac2.d;
    }
    else if (rFrac2[1][0]===0 && rFrac2[1][1]===0) {
        newNum=num1.mul(frac1.s*frac1.n);
        den2=new Polynomial('1');
        rFrac2[2]=[1,0];
        den0=frac1.d;
    }
    // Case where the two denominators are equals
    else if (rFrac1[2][0]===rFrac2[2][0] && rFrac1[2][1]===rFrac2[2][1]){
        let part1=num1.mul(frac1.s*frac1.n);
        let part2=num2.mul(frac2.s*frac2.n);
        den0=frac1.d;
        if (frac1.d!==frac2.d){
            part1=part1.mul(frac2.d);
            part2=part2.mul(frac1.d);
            den0=den0*frac2.d;
        }
        newNum=part1.add(part2);
        rFrac2[2]=[1,0];
        den2=new Polynomial('1');
    }
    // General case
    else {
        den0=frac1.d*frac2.d;
        den2=new Polynomial(rFrac2[2]);
        let part1=num1.mul(den2).mul(frac1.s*frac1.n*frac2.d);
        let part2=num2.mul(den1).mul(frac2.s*frac2.n*frac1.d);
        newNum=part1.add(part2);
    }
    
    //Last simplification if the numerator terms have a common factor.
    let g=gcdCoeffsPoly(newNum);
    
    if (allCoeffsAreNegative(newNum)){g=-g;}
    
    if (g!==1 && polySize(newNum)>1){
        newNum=newNum.mul(1/g);
        let f=math.fraction(g/den0);
        if (newNum.degree()!==0){
            if (newNum.add(den1.neg()).toString()==='0'){
                newNumString=coeffToString(f.n*f.s);
                rFrac1[2]=[1,0];
                den1=new Polynomial('1');
            }
            else{newNumString=coeffToString(f.n*f.s)+ '('+newNum.toString() + ')';}    
        }
        else {newNumString=polyToString(newNum.mul(f.n*f.s));}
        den0=f.d;
    }
    else {
        newNumString=newNum.toString();
    }
    
    let newDenString=printProduct(den0,den1,den2,rFrac1[2],rFrac2[2]);
    
    return [math.parse(newNumString).transform(correctNode),math.parse(newDenString).transform(correctNode)];
}

// Cheking if there are monomials in a product den0*den1*den2 to print its expression in a compact form.
function printProduct(den0,den1,den2,poly1,poly2){
    if (poly1[0]*poly1[1]===0 && poly2[0]*poly2[1]===0) {return den1.mul(den2).mul(den0).toString();}
    else if (poly1[0]*poly1[1]===0) {return polyToString(den1.mul(den0)) + '(' + den2.toString() +')';}
    else if (poly2[0]*poly2[1]===0) {return polyToString(den2.mul(den0)) + '(' + den1.toString() +')';}
    else if (poly1[0]===poly2[0] && poly1[1]===poly2[1]) {return coeffToString(den0) + '('+den1.toString()+ ')^2';} // That one is useful only for multiplications and divisions
    else {return coeffToString(den0) + '(' + den1.toString() + ')(' + den2.toString() + ')';}
}

/*function subtractRationalFraction(ratFrac1,ratFrac2){
    return addRationalFractions(ratFrac1,[[-ratFrac2[0][0],-ratFrac2[0][1]],ratFrac2[1]]);
}*/

function multiplyRationalFraction(ratFrac1,ratFrac2){
    let rFrac1=simplifyRationalFraction(ratFrac1);
    let rFrac2=simplifyRationalFraction(ratFrac2);

    if ((rFrac1[1][0]===0 && rFrac1[1][1]===0) || (rFrac2[1][0]===0 && rFrac2[1][1]===0)){
        return '0';
    }
    else {
        if (rFrac1[1][0]===rFrac2[2][0] && rFrac1[1][1]===rFrac2[2][1]){
            rFrac1[1]=[1,0];
            rFrac2[2]=[1,0];
        }
        if (rFrac1[2][0]===rFrac2[1][0] && rFrac1[2][1]===rFrac2[1][1]){
            rFrac1[2]=[1,0];
            rFrac2[1]=[1,0];
        }
        let prodFrac=math.fraction(rFrac1[0]*rFrac2[0]);
        let num1=new Polynomial(rFrac1[1]);
        let num2=new Polynomial(rFrac2[1]);
        let den1=new Polynomial(rFrac1[2]);
        let den2=new Polynomial(rFrac2[2]);
        let newNumString=printProduct(prodFrac.n*prodFrac.s,num1,num2,rFrac1[1],rFrac2[1]);
        let newDenString=printProduct(prodFrac.d,den1,den2,rFrac1[2],rFrac2[2]);
        return [math.parse(newNumString).transform(correctNode),math.parse(newDenString).transform(correctNode)];
        //return '(' + newNumString + ')/(' + newDenString + ')';
    }
}

/*function divideRationalFraction(ratFrac1,ratFrac2){
    return multiplyRationalFraction(ratFrac1,[ratFrac2[1],ratFrac2[0]]);
}*/


function solveRationalQuestions(rationalQuestion) {
    let op=rationalQuestion[0];
    let ratFrac1=rationalQuestion[1];
    let ratFrac2=rationalQuestion[2];
    if (op==='+'){return addRationalFractions(ratFrac1,ratFrac2);}
    else if (op==='-'){return addRationalFractions(ratFrac1,[[-ratFrac2[0][0],-ratFrac2[0][1]],ratFrac2[1]]);}
    else if (op==='*'){return multiplyRationalFraction(ratFrac1,ratFrac2);}
    else if (op==='/'){return multiplyRationalFraction(ratFrac1,[ratFrac2[1],ratFrac2[0]]);}
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
        p.textContent='\\(' + displayQuestion + ' = ' + printFraction(answer,false) + '\\)';
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
    idExercise=idExerciseBackup;
    divMain.style.display='flex';
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
buttonGraph.addBtnNode('#xvar',14,['#melange']);
buttonGraph.addBtnNode('#xvarPractice',15,['#xvar']);
buttonGraph.addBtnNode('#xvarWithTimer',16,['#xvarPractice']);


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
    
    if (localStorage.getItem('Status Exercise 15')=== 'completed' && (localStorage.getItem('Status Exercise 16')=== 'completed') && divFinished.style.display===''){
        divFinished.style.display='block';
        divFinished.scrollIntoView();
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
                        cleanTimeouts();
                        resetExerciseContainer();
                        divMap.style.display='none';
                        divMain.style.display='flex';
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
                            cleanTimeouts();
                            resetExerciseContainer();
                            divMap.style.display='none';
                            divMain.style.display='flex';
                            //window.removeEventListener('resize',connectAll)
                            initializeExercise(idExercise)
                            MathJax.typeset(document.querySelectorAll('#question'));
                        }
                });
            }
        }
        
        if (node.idExo===idExercise) {btnbis.classList.add('currentBtnMap'); } //btnbis.scrollIntoView(false);

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
    btnConfirmSwitch.removeEventListener('click',switchExercise,{once:true})
}

function openAlertMap(idExercise){
    divAlertMap.classList.add('popDiv');
    divAlertMap.style.display='block';
    btnConfirmSwitch.addEventListener('click',switchExercise, {once:true});
}

function switchExercise(e){
    closeAlertMap();
    cleanTimeouts();
    e.preventDefault();
    resetExerciseContainer();
    divMap.style.display='none';
    divMain.style.display='flex';
    //window.removeEventListener('resize',connectAll)
    initializeExercise(idExercise)
    MathJax.typeset(document.querySelectorAll('#question'));
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
let almostNoTime=false; //Detects when answering with less than 25% of the time
let attemptsWithTimer=0; //Counts the failed attempts due to lack of time

function lowerTimer(){
    if (totalTime>180) {totalTime-=30;}
    else if (totalTime>120 && totalTime<=180) {totalTime-=20;}
    else if (totalTime>60 && totalTime<=120) {totalTime-=10;}
    else if (totalTime>10 && totalTime<=60) {totalTime-=5;}
}

function increaseTimer(){
    if (totalTime<60) {totalTime+=5;}
    else if (totalTime<120 && totalTime>=60) {totalTime+=10;}
    else if (totalTime<270 && totalTime>=120) {totalTime+=30;}
    else if (totalTime>=270) {totalTime=300;}
    // we do not increase the timer above 5 minutes.
}

function printTime(time){
    let timeString='';
    let minutes=Math.floor(time/60);
    let seconds=time%60;
    if (minutes>0) {timeString=timeString+ minutes + '\'';}
    if (seconds>0) {timeString=timeString+ seconds + '"';}
    return timeString;
}

function countDown(timestamp){
    if (!startTime) {
      startTime = timestamp;
    }

    currentTime = timestamp - startTime;
    percent=100-currentTime/(totalTime*1000)*100;
    
    if (Math.round(percent)<=25){
        circleTimer.style.stroke='#FB8500';
        hourGlass.style.color='#FB8500';
        almostNoTime=true;
    }
    
    arcCircle(percent);
    
    if (percent<0){
        hourGlass.style.color='#EF233C';
        startTime=null;
        cancelAnimationFrame(rAF);
        btn.click();
    }
    else {
    rAF=requestAnimationFrame(countDown);
    }
}

function openAlertMain(){
    divAlertMain.classList.add('popDiv');
    divAlertMain.style.display='block';
    spanSpeedRecordAlert.textContent=printTime(Number(localStorage.getItem('Countdown Record ' + idExercise)));
    spanActualSpeedAlert.textContent=printTime(totalTime);
}

function closeAlertMain(){
    divAlertMain.classList.remove('popDiv');
    divAlertMain.style.display='none';
    startTime=null;
}

btnNoMoreTime.addEventListener('click',closeAlertMain);

btnMoreTime.addEventListener('click',function(e){
    e.preventDefault();
    increaseTimer();
    localStorage.setItem('Countdown ' + idExercise,totalTime);
    closeAlertMain();
});
