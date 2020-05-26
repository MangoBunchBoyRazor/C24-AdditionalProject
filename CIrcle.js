class Circle{
    constructor(x,y,r){
        this.body = Bodies.circle(x,y,r/2);
        this.radius = r;
        World.add(world,this.body);
    }
    display(){
        push();
        stroke(0);
        strokeWeight(3);
        noFill();
        translate(this.body.position.x,this.body.position.y);
        rotate(this.body.angle);
        circle(0,0,this.radius);
        line(0,0,this.radius/2,0);
        pop();
    }
}