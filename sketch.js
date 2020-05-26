//Aliases for the Matter modules
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;

//Creating global variables
var engine, world, mConstraint;
var parts = [], size, rows, columns, a, parts2 = [], parts3 = [];

function setup(){
    //Creating a canvas
    let Canvas = createCanvas(1200,600);
    //Creating the engine
    engine = Engine.create();
    world = engine.world; // Variable reference for engine.world
    world.gravity = {x: 0, y: 0.5, scale: 0.001}; // Setting the gravity

    //Declaring the castle attributes
    size = round(random(40,45));
    rows = round(random(3,7));
    columns = round(random(6,12));

    //Calling function to draw the castle
    drawCastle(columns,rows,size);

    //Creating the constraint
    let prev = null;
    for(i = 100; i <= 500; i += 25){
        var p1 = new Circle(100+(columns+7)*size,i,20);
        parts3.push(p1);

        if(prev){
            var options = {
                bodyA: p1.body,
                bodyB: prev.body,
                length: 30,
                stiffness: 0.3
            };
            var constraint = Constraint.create(options);
            World.add(world,constraint);
        }
        else
            Body.setStatic(p1.body, true);
        prev = p1;
    }

    //Creating the mouse constraint
    mConstraint = MouseConstraint.create(engine, {
        mouse: Mouse.create(Canvas.elt)
    });
    World.add(world,mConstraint);

    //The ground
    groundbody = new Ground(width/2,580,width,20);
}

function draw(){
    //The sky
    background(100,100,255);
    //The horizon
    push();rectMode(CORNER);fill(0,255,0);rect(0,500,width,100);pop();
    //Updating the engine
    Engine.update(engine);
    //Displaying all the objects
    for(i = 0; i < parts.length; i++)
        parts[i].display();
    for(j = 0; j < parts2.length; j++)
        parts2[j].display();
    for(k = 0; k < parts3.length; k++)
        parts3[k].display();

    groundbody.display();

    //Highlighting the body the mouse is touching
    if(mConstraint.body){
        let pos = mConstraint.body.position;
        let m = mConstraint.mouse.position;
        let offset = mConstraint.constraint.pointB;
        push();
        fill(0,255,0);
        ellipse(pos.x,pos.y,20,20);
        stroke(0);
        strokeWeight(3);
        line(pos.x+offset.x,pos.y+offset.y,m.x,m.y);
        pop();
    }

    //Goal of the game
    //The player should break the castle but cannot
    //because the building blocks are static
    //If the player brings any two triangles down then the castle will fall
    let l = 0;
    for(n = 0; n < parts2.length; n++){
        if(parts2[n].body.position.y > 500)
            l++;
    }
    if(l >= 2){
        for(o = 0; o < parts.length; o++)
            Body.setStatic(parts[o].body, false);
    
    }
    //Displaying the text
    textSize(20);
    textAlign(CENTER);
    fill(255,100,100,255);
    text("Can you break the castle?",400,50);
    text("Hint: Use the chain",400,75);
    text("Rows: "+rows,700,50);
    text("Columns: "+columns,900,50);
    text("Size: "+size,1100,50);
}
//Function to create the input boxes and buttons
function las(){
    inp=createInput(rows);
    inp.position(720,92);
    inp.size(50);
    inp1=createInput(columns);
    inp1.position(935,92);
    inp1.size(50);
    inp2=createInput(size);
    inp2.position(1110,92);
    inp2.size(50);
    btn=createButton('submit');
    btn.position(1170,92);
    btn.mouseClicked(submit);
}
function submit(){
    inp.remove();
    inp1.remove();
    inp2.remove();
    btn.remove();
    if(isNaN(inp.value()) || isNaN(inp1.value()) || isNaN(inp2.value())){
        console.error("Invalid value entered");
        return false;
    }
    else if(inp.value() < 3 || inp.value() > 7
            || inp1.value() < 6 || inp1.value() > 12
            || inp2.value() < 40 || inp2.value() > 45){
            console.error("number not whithin range. Valid range is 3 to 7 for rows, 6 to 12 for columns and 40 to 45 for size");
            return false;
    }
    else{
        rows = inp.value() * 1;
        columns = inp1.value() * 1;
        size = inp2.value() * 1;

        //Removing the bodies of the objects
        for(i = 0; i < parts.length; i++)
            World.remove(world,parts[i].body);
        for(j = 0; j < parts2.length; j++)
            World.remove(world,parts2[j].body);

        //Removing the objects from the array
        parts.splice(0,parts.length);
        parts2.splice(0,parts2.length);

        //Redrawing the castle
        drawCastle(columns,rows,size);

        return true
    }
}
//Function for drawing the castle
function drawCastle(c,r,s){
    //Creating the castle towers
    let i = 1;
    for(h = r + 2; h > 0; h--){
        let y = height-h*s;
        if(i%2===0){
            parts.push(new Box(112+(c+1)*s,y,s+5,s+5,'red',0,true));
            parts.push(new Box((88+s)-s,y,s+5,s+5,'red',0,true));
        }
        else{
            parts.push(new Box(112+(c+1)*s,y,s+5,s+5,'purple',0,true));
            parts.push(new Box((88+s)-s,y,s+5,s+5,'purple',0,true));
        }
        i++;
    }
    let x1 = 112+(c+1)*s;
    let x2 = (88+s)-s;
    let y = height - (r+3)*s;
    let y2 = height - (r+4)*s;
    parts.push(new Box(x1,y,s - 10,s,'blue',0,true));
    parts2.push(new Triangle(x1,y2));
    parts2.push(new Triangle(x2,y2));
    parts.push(new Box(x2,y,s - 10,s,'blue',0,true));

    //Creating the main castle walls
    let k = 1;
    for(i = c; i > 0; i--){
        if(k%2==0)
            for(j = r; j > 0; j--)
                parts.push(new Box(100+i*s,height-j*s,s,s,'red',0.8,true));
        else
            for(j = r; j > 0; j--)
                parts.push(new Box(100+i*s,height-j*s,s,s,'yellow',0.8,true));
                
        if(i - 1 == 0 || i + 1 > c){
            let x = 100+i*s;
            let y = height - (r*s+3*s);
            parts.push(new Box(x,height-(r*s+s),s-10,s,'blue',0,true));
            parts2.push(new Triangle(x,y));
        }
        //Upper section of the castle
        if(k >= 1 && k < c - 1)
            for(l = r - 2; l > 0;  l--)
                parts.push(new Box(100+(i-1)*s,height-((l+r)*s),s-10,s,'blue',0,true));
        k++;
    }
    //Creaing the side section of the castle
    for(m = 3; m > 0; m--){
        for(o = r; o > 0; o--){
            parts.push(new Box(170+(c+m)*s,height-o*s,s-1,s-1,100,0,true));
        }
    }
    parts.push(new Box(170+(c+3)*s,height-(r+1)*s,s-10,s-5,'blue',0,true));
    parts2.push(new Triangle(170+(c+3)*s,height-(r+2)*s));
}