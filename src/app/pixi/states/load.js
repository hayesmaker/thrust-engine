
export default class Load {
  constructor(stage) {
    this.hasStarted = false;
    this.stage = stage;
    this.onComplete = null;
    this.onCompleteContext = null;
  }


  start () {
    this.hasStarted = true;
    this.preload();
  }

  preload () {
    loader.add(global.ASSETS.textureAtlasPath)
      .load(this.create.bind(this));
  }

  create () {
    this.complete();
  }

  load () {

  }

  update () {
    if (!this.hasStarted) {
      this.start();
    }
  }

  complete () {
    this.nextState();
  }

  nextState() {
    if (this.onComplete && this.onCompleteContext) {
      this.onComplete.call(this.onCompleteContext);
    }

  }
}