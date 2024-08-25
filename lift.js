const generateButton = document.getElementById("generate");
const errorElement = document.getElementById("error");
const simulationElement = document.getElementById("Simulation");


let floorData = [];
let liftData = [];
let inProgressLifts = new Set();

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

    // Gets input from User
generateButton.addEventListener('click', function(){
    errorElement.innerHTML = "";
    simulationElement.innerHTML = "";
    liftPositions = [];
    isMoving = [];
    floorData = [];
    liftData = [];

    let floorInput = document.getElementById("floorInput").value;
    let liftInput = document.getElementById("LiftInput").value;

    if(!floorInput || !liftInput){
        errorElement.innerHTML = "The value of floors & lifts can't be null";  
        return; 
    }

    if(liftInput < 1|| floorInput < 1 ||floorInput > 10 || liftInput > 10){
        errorElement.innerHTML = "Please enter a valid value between 1-10";
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

    if(i == 0){

        const liftStructure = document.createElement("div");
        liftStructure.className = "lift-structure";

        const liftControls = document.createElement("div");
        liftControls.className = "lift-Controls";
    
        const upButton = document.createElement("button");
        upButton.innerHTML = "Up";
        upButton.className = "button up";
        upButton.id = "upButton-"+i;
        upButton.addEventListener("click", ()=>{
            callLift(upButton.id);
        });
        liftControls.appendChild(upButton);
    
        const downButton = document.createElement("button");
        downButton.innerHTML = "Down";
        downButton.className = "button down";
        downButton.disabled = true;
        downButton.id = "downButton-"+i;
        downButton.addEventListener("click", ()=>{
            callLift(downButton.id);
        });
        // liftControls.appendChild(downButton);
    
        liftStructure.appendChild(liftControls);

        const lifts = document.createElement("div");
        lifts.className = "lifts"

        for(let i = 0; i < liftInput; i++){
            const lift = document.createElement("div");
            lift.className = "lift"
            lift.id = "lift-"+i;
            liftPositions.push(0);
            isMoving.push(false);
            lifts.appendChild(lift);
        }

        liftStructure.appendChild(lifts);
        floorBody.appendChild(liftStructure);

    }

    else{
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
                callLift(upButton.id);
            });
            liftControls.appendChild(upButton);
        }
    
        const downButton = document.createElement("button");
        downButton.innerHTML = "Down";
        downButton.className = "button down";
        downButton.id = "downButton-"+i;
        downButton.addEventListener("click", ()=>{
            callLift(downButton.id);
        });
        liftControls.appendChild(downButton);
    
        floorBody.appendChild(liftControls);
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

const callLift = (buttonId)=>{

    console.log("------------------------------------------");
    const destinationFloor = Number(buttonId.match(/\d+/g));

    console.log(`Button pushed: ${buttonId}`);
    console.log("destination floor: "+destinationFloor);
    console.log(`calling a lift...`);

    let direction = buttonId.includes("up") ? "Up" : "down";

    let targetLiftIndex = findTheTagetLift(destinationFloor, direction);

    if(targetLiftIndex == null){
        console.log("Lift already exist at this floor for this direction");
        return;
    }
    else if (targetLiftIndex == -1){
        // No lift is free, Write a queuing method to store values in queue.
        // let queueInterval = setInterval(()=>{
        //     targetLiftIndex = findTheTagetLift(destinationFloor, direction);
        //     if (targetLiftIndex != -1){
        //         clearInterval(queueInterval);
        //     }
        // }, 1000);

        return;
    }

    console.log("Target lift: "+targetLiftIndex);

    moveLift(targetLiftIndex, destinationFloor, direction);
}

const moveLift = async(targetLiftIndex, destinationFloor, direction)=>{
    console.log("Move Lift started...");
    // console.log("Lift positions: " + liftPositions);

    const targetY = (0 - destinationFloor)*120;
    const targetTime = Math.abs((liftData[targetLiftIndex].liftPosition - destinationFloor) * 2); 

    console.log("targetY: "+targetY);
    console.log("targetTime: "+targetTime);

    inProgressLifts.add(direction+destinationFloor);

    document.getElementById(`lift-${targetLiftIndex}`).style.setProperty('--lift-distance', `${targetY}px`);
    document.getElementById(`lift-${targetLiftIndex}`).style.setProperty('--lift-duration', `${targetTime}s`);

    // liftPositions[targetLiftIndex] = -1;
    liftData[targetLiftIndex].isMoving = true;
    liftData[targetLiftIndex].direction = direction;

    setTimeout(() => {
        liftData[targetLiftIndex].liftPosition = destinationFloor;
        liftData[targetLiftIndex].isMoving = false;
        inProgressLifts.delete(direction+destinationFloor);
    }, targetTime*1000);

    console.log("------------------------------------------");
}

const findTheTagetLift = (destinationFloor, direction)=>{

    if (inProgressLifts.has(direction+destinationFloor)){
        return null;
    }
    let currentResultIndex = -1;
    let currentMinimum = Infinity;

    let availableLifts = liftData.filter((lift) => lift.isMoving == false )
    console.log(`Available lifts: `, availableLifts);

    for(let i = 0; i < availableLifts.length; i++){
        // if(availableLifts[i].liftPosition == destinationFloor && availableLifts[i].direction == direction){}
        let diff = Math.abs(availableLifts[i].liftPosition - destinationFloor);
        
        if(diff == 0){
            if (availableLifts[i].direction === direction || liftData.length == 1)
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

