class Box {
  constructor(x, y, width, height,Color,restitution,Static) {
    var options = {
        'restitution': restitution,
        'friction':0.3,
        'density':1.0,
        'isStatic': Static
    }
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;
    
    World.add(world, this.body);

    this.color = color(Color);
  }
  display(){
    var pos =this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x,pos.y);
    rotate(angle);
    rectMode(CENTER);
    fill(this.color);
    rect(0,0, this.width, this.height);
    pop();
  }
};