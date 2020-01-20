const Matter = require('matter-js');

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Constraint = Matter.Constraint;

const engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 640,
    height: 480,
    hasBounds: true
  }
});

var runner = Runner.create();

Runner.run(runner, engine);

Render.run(render);

const floor = new Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, 100, { isStatic: true });
const floor2 = new Bodies.rectangle(320, 500, 900, 50, { isStatic: true });

const wheel = new Bodies.circle(50, 200, 20, 20);
const body = new Bodies.rectangle(50, 0, 10, 10);
const wheelBodyConstraint = Constraint.create({
  bodyA: wheel,
  bodyB: body,
  damping: 0.1,
  render: {
    anchors: true,
    lineWidth: 5
  }
});

wheel.set

World.add(engine.world, [floor, floor2, wheel, body, wheelBodyConstraint]);

const keyWatcher = {};

render.element.addEventListener("keydown", function keyDownHandler(e) {
  keyWatcher[e.keyCode] = true;
  console.log(`Keydown! Code: ${e.keyCode}`);
});

render.element.addEventListener("keyup", function keyUpHandler(e) {
  keyWatcher[e.keyCode] = false;
  console.log(`Keyup! Code: ${e.keyCode}`);
});



let lastTick = engine.timing.timestamp;
Matter.Events.on(runner, 'beforeTick', function beforeTick(e) {
  const dT = e.timestamp - lastTick;

  // 39 = right, 37 = left
  if(keyWatcher[39]) {
    //Body.applyForce(wheel, wheel.position, Vector.create(0, -0.07 / 1000 * dT));
    Body.applyForce(wheel, Vector.add(wheel.position, { x: 0, y: 1000 }), { x: -0.03 / 10000 * dT, y: 0 });
  }

  if(keyWatcher[37]) {
    //Body.applyForce(wheel, wheel.position, Vector.create(0, -0.07 / 1000 * dT));
    Body.applyForce(wheel, Vector.add(wheel.position, { x: 0, y: 1000 }), { x: 0.03 / 10000 * dT, y: 0 });
  }

  lastTick = e.timestamp;
});

Matter.Events.on(runner, 'afterTick', function afterTick(e) {
  const dT = e.timestamp - lastTick;

  // Follow hero
  render.bounds.min.x = wheel.position.x - 640 / 2;
  render.bounds.max.x = wheel.position.x + 640 / 2;
  render.bounds.min.y = wheel.position.y - 480 / 2;
  render.bounds.max.y = wheel.position.y + 480 / 2;
});