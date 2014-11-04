/*
@pjs  preload="images/lightbackground.jpg";
      pauseOnBlur="true";
*/

HPixelColorist  colorist;
HSwarm          brush;
HDrawablePool   objPool;
HTimer          timer;
int             twitch;
int             randMaxW;
int             randMaxH;
int             multiplier;
boolean         started;
PImage          img;

void addMultiplier(int value) {
  multipler = value;
}

void addTwitchVariation(int value) {
  twitch = value;
}

void addRandMaxWVariation(int value) {
  randMaxW = value;
}

void addRandMaxHVariation(int value) {
  randMaxH = value;
}

void setup() {
  started = false;

  // Set fullscreen.
  size(screen.width, screen.height);

  // Call to attic.js to process fullscreen adjustments.
  configureProcessingSizing();
}

void start() {
  background(0, 0);
  // Init HYPE.
  H.init(this).autoClear(false);

  // Get colors from background image.
  colorist = new HPixelColorist('images/lightbackground.jpg');

  // Use a swarm like a brush, loosely following mouse cursor.
  brush = new HSwarm().addGoal(H.mouse()).speed(10).turnEase(0.1f).twitch(twitch);

  // Limit the swarm to an object pool of 70 elements.
  objPool = new HDrawablePool(70);

  // Spawn object from pool to draw (see swarm examples from docs).
  objPool.autoAddToStage()
         .add(new HRect().rounding(20))
         .onCreate(
           new HCallback() {
             public void run(Object obj) {
               HDrawable drawable = (HDrawable) obj;

               drawable.size((int)random(1, randMaxW), (int)random(1, randMaxH))
                       .noStroke()
                       .fill(#000000)
                       .loc(H.mouse().x(), H.mouse().y());

               colorist.applyColor(drawable);
               brush.addTarget(drawable);
             }
           }
         );

  // Spawning depends on a timer-based cycle.
  timer = new HTimer()
            .numCycles(objPool.numActive())
            .interval(100)
            .callback(
              new HCallback() {
                public void run(Object obj) {
                  objPool.request();
                }
              }
            );

  started = true;
}

void draw() {
  if (started) {
    // Color each element from the brush with colors from pixels of the underlying image.
    for (HDrawable drawable:objPool) {
      colorist.applyColor(drawable.alpha(50));
    }

    H.drawStage();
  }
}

void resize(float x, float y) {
  size(x, y);
}