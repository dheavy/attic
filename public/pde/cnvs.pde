/*
@pjs  preload="images/darkbackground.jpg";
      pauseOnBlur="true";
*/

HPixelColorist  colorist;
HSwarm          brush;
HDrawablePool   objPool;
HTimer          timer;
int             twitch;
int             randMaxW;
int             randMaxH;
boolean         started;

void addVariation1(int value) {
  twitch = 10 * value;
}

void addVariation2(int value) {
  randMaxW = value;
}

void addVariation3(int value) {
  randMaxH = value;
}

void setup() {
  started = false;
  background(0, 0);

  // Set fullscreen.
  size(screen.width, screen.height);

  // Call to attic.js to process fullscreen adjustments.
  configureProcessingSizing();
}

void start() {
  // Init HYPE.
  H.init(this).autoClear(false);

  // Get colors from background image.
  colorist = new HPixelColorist('images/darkbackground.jpg');

  // Use a swarm like a brush, loosely following mouse cursor.
  brush = new HSwarm().addGoal(H.mouse()).speed(10).turnEase(0.05f).twitch(twitch);

  // Limit the swarm to an object pool of 60 elements.
  objPool = new HDrawablePool(60);

  // Spawn object from pool to draw (see swarm examples from docs).
  objPool.autoAddToStage()
         .add(new HRect().rounding(4))
         .onCreate(
           new HCallback() {
             public void run(Object obj) {
               HDrawable drawable = (HDrawable) obj;

               drawable.size((int)random(2, randMaxW), (int)random(2, randMaxH))
                       .noStroke()
                       .fill(#000000)
                       .loc(width / 2, height / 2);

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