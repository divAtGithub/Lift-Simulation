const generateButton = document.getElementById("generate");
const errorElement = document.getElementById("error");
const simulationElement = document.getElementById("Simulation");


let floorData = [];
let liftData = [];
let inProgressLifts = new Set();
let timeOuts = [];

class LiftQueue{
    constructor(){
        this.queue = [];
    }
    
    enqueue(liftOperation){
        this.queue.push(liftOperation);
        console.log("Enqueue started: ", this.queue, liftOperation);
        this.processNext();
    }
    
    async processNext(){
        console.log("-------------------------------------------");
        console.log("ProcessNext function started with queue: ", this.queue);
        if(this.queue.length === 0){
            console.log("Queue Empty, returning from processNext function");
            return;
        }
        
        const request = this.queue[0];
        console.log(request);

        const targetLiftIndex = findTheTagetLift(request.targetFloor, request.targetDirection);       
        console.log("target lift index: ",targetLiftIndex); 

        if(targetLiftIndex != null && targetLiftIndex != -1){
            this.queue.shift();
            moveLift(targetLiftIndex, request.targetFloor,  request.targetDirection);
            //this.processNext();
        }       

        else{
            console.log("Returing from process next function because targetliftIndex is: "+targetLiftIndex);
            return;
        }
        console.log("");

    } 


}

const liftQueue = new LiftQueue();

class LiftOperations{
    constructor(target){
        this.targetFloor =  Number(target.match(/\d+/g));;
        this.targetDirection = target.includes("up") ? "Up" : "down";;
    }
}

function floorInfo (floorId, upLift, downLift){
    this.floorId = floorId;
    this.upLift = upLift;
    this.downLift = downLift;
}

function liftInfo (liftId, liftPosition, isMoving, direction){
    this.liftId = liftId;
    this.liftPosition = liftPosition;
    this.isMoving = isMoving;
    this.direction = direction;
}

generateButton.addEventListener('click', function(){
    errorElement.innerHTML = "";
    simulationElement.innerHTML = "";
    liftPositions = [];
    isMoving = [];
    floorData = [];
    liftData = [];

    timeOuts.filter((val)=>{clearTimeout(val)});
    timeOuts = [];

    inProgressLifts.clear();

    let floorInput = document.getElementById("floorInput").value;
    let liftInput = document.getElementById("LiftInput").value;

    if(!floorInput || !liftInput){
        errorElement.innerHTML = "The value of floors & lifts can't be null";  
        return; 
    }

    if(liftInput < 1 || floorInput < 2 ){
        errorElement.innerHTML = " Please enter a valid input. \n Floors >= 2 and Lifts >= 1";
        return;
    }

    else{
        generateSimulation(liftInput, floorInput);
    }
})

const generateSimulation = (liftInput, floorInput)=>{
    // console.log("Simulation Started!");
    // console.log(liftInput, floorInput);

    for(let i=floorInput-1; i>=0; i--){
        generateFloorBody(i, liftInput, floorInput);
    }

    for(let i = 0; i < floorInput; i++){
        floorData.push(new floorInfo(i, -1, -1));
    }

    for(let i = 0; i < liftInput; i++){
        liftData.push(new liftInfo(i, 0, false));
    }
}

const generateFloorBody = (i,liftInput, floorInput)=>{
    const floorBody = document.createElement("div");
    floorBody.className = "floor-body";
    floorBody.style.width = ((120)*(+liftInput+1)) +'px';
    // console.log(floorBody.style.width);

    if(i == 0 && liftInput >= 1){

        const liftStructure = document.createElement("div");
        liftStructure.className = "lift-structure";

        const liftControls = document.createElement("div");
        liftControls.className = "lift-Controls";
    
        const upButton = document.createElement("button");
        upButton.innerHTML = "Up";
        upButton.className = "button up";
        upButton.id = "upButton-"+i;
        upButton.addEventListener("click", ()=>{
            // console.log("button clicked");
            const liftOperation = new LiftOperations(upButton.id);
            if(liftQueue.queue.filter((val) => val.targetFloor == liftOperation.targetFloor && val.targetDirection == liftOperation.targetDirection).length != 0){
                return;
            }
            liftQueue.enqueue(liftOperation);
            //callLift(upButton.id);
        });
        liftControls.appendChild(upButton);
    
        const downButton = document.createElement("button");
        downButton.innerHTML = "Down";
        downButton.className = "button down";
        downButton.disabled = true;
        downButton.id = "downButton-"+i;
        downButton.addEventListener("click", ()=>{
            const liftOperation = new LiftOperations(downButton.id);
            if(liftQueue.queue.filter((val) => val.targetFloor == liftOperation.targetFloor && val.targetDirection == liftOperation.targetDirection).length != 0){
                return;
            }
            liftQueue.enqueue(liftOperation);
            // callLift(downButton.id);
        });
        // liftControls.appendChild(downButton);
    
        liftStructure.appendChild(liftControls);

        const liftsWrapper = document.createElement("div");
        liftsWrapper.className = "lifts-wrapper";

        const lifts = document.createElement("div");
        lifts.className = "lifts"

        for(let i = 0; i < liftInput; i++){
            const lift = document.createElement("div");
            lift.className = "lift"
            lift.id = "lift-"+i;
            const leftDoor = document.createElement("div");
            leftDoor.className = "left-door";
            leftDoor.classList.add("door");
            const rightDoor = document.createElement("div");
            rightDoor.className = "right-door";
            rightDoor.classList.add("door");
            lift.appendChild(leftDoor);
            lift.appendChild(rightDoor);
            liftPositions.push(0);
            isMoving.push(false);
            lifts.appendChild(lift);
        }

        liftsWrapper.appendChild(lifts);
        liftStructure.appendChild(liftsWrapper);
        floorBody.appendChild(liftStructure);

    }

    else{
        if(liftInput >=1 ){
            const liftControls = document.createElement("div");
            liftControls.className = "lift-Controls";
        
            const upButton = document.createElement("button");
            upButton.innerHTML = "Up";
            upButton.className = "button up";
            if (i == floorInput-1){
                upButton.disabled = true;
                upButton.id = "upButton-"+i;
                // liftControls.appendChild(upButton);
            }
            else{
                upButton.id = "upButton-"+i;
                upButton.addEventListener("click", ()=>{
                    const liftOperation = new LiftOperations(upButton.id);
                    if(liftQueue.queue.filter((val) => val.targetFloor == liftOperation.targetFloor && val.targetDirection == liftOperation.targetDirection).length != 0){
                        return;
                    }
                    liftQueue.enqueue(liftOperation);
                    //callLift(upButton.id);
                });
                liftControls.appendChild(upButton);
            }
        
            const downButton = document.createElement("button");
            downButton.innerHTML = "Down";
            downButton.className = "button down";
            downButton.id = "downButton-"+i;
            downButton.addEventListener("click", ()=>{
                const liftOperation = new LiftOperations(downButton.id);
                if(liftQueue.queue.filter((val) => val.targetFloor == liftOperation.targetFloor && val.targetDirection == liftOperation.targetDirection).length != 0){
                    return;
                }
                liftQueue.enqueue(liftOperation);
                // callLift(downButton.id);
            });
            liftControls.appendChild(downButton);
        
            floorBody.appendChild(liftControls);
        }
  
    }

    const floorLineContainer = document.createElement("div");
    floorLineContainer.className = "floor-line-container";

    const floorLine = document.createElement("hr");
    floorLine.className = "floor-line";

    const floorNum = document.createElement("span");
    floorNum.innerHTML = "Floor "+ (i+1); 

    floorLineContainer.appendChild(floorLine);
    floorLineContainer.appendChild(floorNum);

    floorBody.appendChild(floorLineContainer);

    simulationElement.appendChild(floorBody);

}

// const callLift = (buttonId)=>{

//     console.log("------------------------------------------");
//     const destinationFloor = Number(buttonId.match(/\d+/g));

//     console.log(`Button pushed: ${buttonId}`);
//     console.log("destination floor: "+destinationFloor);
//     console.log(`calling a lift...`);

//     let direction = buttonId.includes("up") ? "Up" : "down";

//     // let targetLiftIndex = findTheTagetLift(destinationFloor, direction);

//     // if(targetLiftIndex == null){
//     //     console.log("Lift already exist at this floor for this direction");
//     //     return;
//     // }
//     // else if (targetLiftIndex == -1){
//     //     // No lift is free, Write a queuing method to store values in queue.
//     //     // let queueInterval = setInterval(()=>{
//     //     //     targetLiftIndex = findTheTagetLift(destinationFloor, direction);
//     //     //     if (targetLiftIndex != -1){
//     //     //         clearInterval(queueInterval);
//     //     //     }
//     //     // }, 1000);

//     //     return;
//     // }

//     // console.log("Target lift: "+targetLiftIndex);

//     moveLift(targetLiftIndex, destinationFloor, direction);
// }

function toggleDoors(liftId) {
    // console.log("Toggle door started!", performance.now());
    const lift = document.getElementById(liftId);
    const leftDoor = lift.querySelector('.left-door');
    const rightDoor = lift.querySelector('.right-door');

    leftDoor.classList.toggle('open');
    rightDoor.classList.toggle('open');

    const t1 = setTimeout(() => {
        leftDoor.classList.toggle('open');
        rightDoor.classList.toggle('open');    
        // console.log("Toggle door ended!",performance.now());
    }, 2500);

    timeOuts.push(t1);

  }

const moveLift =  (targetLiftIndex, destinationFloor, direction)=>{
    console.log("Move Lift started...", targetLiftIndex, direction, destinationFloor);
    // console.log("Lift positions: " + liftPositions);

    const targetY = (0 - destinationFloor)*145;
    const targetTime = Math.abs((liftData[targetLiftIndex].liftPosition - destinationFloor) * 2); 


    inProgressLifts.add(direction+destinationFloor);

    document.getElementById(`lift-${targetLiftIndex}`).style.setProperty('--lift-distance', `${targetY}px`);
    document.getElementById(`lift-${targetLiftIndex}`).style.setProperty('--lift-duration', `${targetTime}s`);

    const t2 = setTimeout(() => {
        toggleDoors(`lift-${targetLiftIndex}`);
    }, targetTime*1000);

    timeOuts.push(t2);

    liftData[targetLiftIndex].isMoving = true;
    liftData[targetLiftIndex].direction = direction;


    // return new Promise((resolve)=>{

    //     setTimeout(() => {
    //         const endTime = performance.now();
    //         const actualDelay = endTime - startTime;
    
    //         liftData[targetLiftIndex].liftPosition = destinationFloor;
    //         liftData[targetLiftIndex].isMoving = false;
    //         inProgressLifts.delete(direction+destinationFloor);
    //         console.log("Move lift ending");
    //         console.log("Move lift ending. Expected time:", targetTime * 1000, "Actual time:", actualDelay);

    //         resolve();
    //     }, targetTime*1000);
    // });
    
        const startTime = performance.now();

        const t3 = setTimeout(() => {
            const endTime = performance.now();
            const actualDelay = endTime - startTime;
    
            liftData[targetLiftIndex].liftPosition = destinationFloor;
            liftData[targetLiftIndex].isMoving = false;
            inProgressLifts.delete(direction+destinationFloor);
            console.log("Move lift ending. Expected time:", targetTime * 1000, "Actual time:", actualDelay);

            console.log(liftQueue);
            console.log("-------------------------------------------");
            const lift = document.getElementById(`lift-${targetLiftIndex}`);

           liftQueue.processNext();
        }, (targetTime*1000)+3000);
    
        timeOuts.push(t3);

    // console.log("------------------------------------------");
}

const findTheTagetLift = (destinationFloor, direction)=>{

    if (inProgressLifts.has(direction+destinationFloor)){
        // return null;
        return liftData.filter((liftInfo)=>{liftInfo.liftPosition == destinationFloor && liftInfo.direction == direction})
    }
    let currentResultIndex = -1;
    let currentMinimum = Infinity;

    let availableLifts = liftData.filter((lift) => lift.isMoving == false )
    console.log(`Available lifts: `, availableLifts);

    for(let i = 0; i < availableLifts.length; i++){
        // if(availableLifts[i].liftPosition == destinationFloor && availableLifts[i].direction == direction){}
        let diff = Math.abs(availableLifts[i].liftPosition - destinationFloor);
        
        if(diff == 0){
            if (availableLifts[i].direction === direction || liftData.length == 1 || availableLifts[i].direction === undefined )
                return availableLifts[i].liftId;
            else{
                continue;
            }
        }
        
        if (diff < currentMinimum){
            currentMinimum = diff;
            currentResultIndex = availableLifts[i].liftId;
        }
    }

    return currentResultIndex;
}

