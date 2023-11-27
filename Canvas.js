export class Canvas {
  static pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
  static stageWidth = document.body.clientWidth;
  static stageHeight = document.body.clientHeight;

  constructor() {
    this.isStatic;
    this.element = document.createElement("canvas");

    this.ctx = this.element.getContext("2d");
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  static resize() {
    Canvas.stageWidth = document.body.clientWidth;
    Canvas.stageHeight = document.body.clientHeight;
    Canvas.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
  }

  resize() {
    this.element.width = Canvas.stageWidth * Canvas.pixelRatio;
    this.element.height = Canvas.stageHeight * Canvas.pixelRatio;
  }
}
