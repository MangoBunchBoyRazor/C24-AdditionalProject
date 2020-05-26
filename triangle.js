class Triangle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        var options = {
            isStatic: false,
            restitution: 0,
            angle: PI/2
        }
        this.body = Bodies.polygon(this.x,this.y,3,size - 12,options);
        World.add(world,this.body);
    }
    display(){
        let v = this.body.vertices;
        push();
        fill(255,0,0);
        triangle(v[0].x,v[0].y,v[1].x,v[1].y,v[2].x,v[2].y);
        pop();
    }
}