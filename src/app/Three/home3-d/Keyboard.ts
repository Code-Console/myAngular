import { TouchType } from "src/app/Interface";
import * as THREE from "three";

const resetValue = {
  sx: 0,
  sy: 0,
  sz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  reset: false,
};

export class EventList {
  callbackEventListeners: (props: any) => void;
  initDistance = 0;
  isMouseDown = false;
  mouse = new THREE.Vector2();
  mouseMultiTouch = new THREE.Vector2();
  mouseDownPos = new THREE.Vector2();
  domElement!: HTMLCanvasElement;
  constructor(
    callbackEventListeners: (props: any) => void,
    domElement: HTMLCanvasElement
  ) {
    this.callbackEventListeners = callbackEventListeners;
    this.domElement = domElement;
    this.addEventListeners();
  }
  eventDown = (ev: MouseEvent | TouchEvent) => {
    this.touchEvent(ev, TouchType.touchDown, 0);
  };
  eventMove = (ev: MouseEvent | TouchEvent) => {
    this.touchEvent(ev, TouchType.touchMove, 0);
  };

  eventUp = (ev: MouseEvent | TouchEvent) => {
    this.touchEvent(ev, TouchType.touchUp, 0);
  };
  onPinch = (ev: any) => {
    console.log(ev);
  };

  addEventListeners = () => {
    document.addEventListener("keydown", dealWithKeyboard);

    document.addEventListener("mousedown", this.eventDown);
    document.addEventListener("touchstart", this.eventDown);

    document.addEventListener("mousemove", this.eventMove);
    document.addEventListener("touchmove", this.eventMove);

    document.addEventListener("mouseup", this.eventUp);
    document.addEventListener("touchend", this.eventUp);

    dealWithKeyboard(0);
  };
  removeEventListeners = () => {
    document.removeEventListener("keydown", dealWithKeyboard);

    document.removeEventListener("mousedown", this.eventDown);
    document.removeEventListener("touchstart", this.eventDown);

    document.removeEventListener("mousemove", this.eventMove);
    document.removeEventListener("touchmove", this.eventMove);

    document.removeEventListener("mouseup", this.eventUp);
    document.removeEventListener("touchend", this.eventUp);

    dealWithKeyboard(0);
  };

  touchEvent = (e: any, type: any, sys: any) => {
    const CANVAS_HEIGHT = window.innerHeight;
    const CANVAS_WIDTH = window.innerWidth;
    if (e.touches !== null && e.touches !== undefined) {
      if (e.touches.length > 0) {
        this.mouse.x = (e.touches[0].pageX / CANVAS_WIDTH) * 2 - 1;
        this.mouse.y = -(e.touches[0].pageY / CANVAS_HEIGHT) * 2 + 1;
        if (e.touches.length === 2) {
          this.mouseMultiTouch.x =
            (e.touches[1].pageX / window.innerWidth) * 2 - 1;
          this.mouseMultiTouch.y =
            -(e.touches[1].pageY / window.innerHeight) * 2 + 1;
          if (type === TouchType.touchDown) {
            this.initDistance = this.mouseMultiTouch.distanceTo(this.mouse);
            this.onPinch({ type: "pinchStart", scale: 1 });
          } else {
            const currentDistance = this.mouseMultiTouch.distanceTo(this.mouse);
            this.onPinch({
              type: "pinchMove",
              scale: currentDistance / this.initDistance,
            });
          }
        }
      }
    } else {
      const elem = this.domElement,
        boundingRect = elem.getBoundingClientRect();
      const x =
        (e.clientX - boundingRect.left) * (elem.width / boundingRect.width);
      const y =
        (e.clientY - boundingRect.top) * (elem.height / boundingRect.height);
      this.mouse.x = (x / CANVAS_WIDTH) * 2 - 1;
      this.mouse.y = -(y / CANVAS_HEIGHT) * 2 + 1;
    }
    if (type === TouchType.touchDown) {
      this.mouseDownPos.x = this.mouse.x;
      this.mouseDownPos.y = this.mouse.y;
      this.isMouseDown = true;
      if (e.touches?.length > 1) this.isMouseDown = false;
    }
    if (type === TouchType.touchUp) {
      this.isMouseDown = false;
    }
    this.callbackEventListeners({
      mouse: this.mouse,
      isMouseDown: this.isMouseDown,
    });
  };
}

export const dealWithKeyboard = (e: any) => {
  if (!window?.setKey?.sx) {
    window["setKey"] = resetValue;
  }
  const keys = window["setKey"];
  const vs = 1,
    rs = 0.1;
  switch (e.keyCode) {
    case 37:
      keys.sx = keys.sx - vs;
      break;
    case 38:
      keys.sz = keys.sz + vs;
      break;
    case 39:
      keys.sx = keys.sx + vs;
      break;
    case 40:
      keys.sz = keys.sz - vs;
      break;
    case 65:
      keys.sy = keys.sy + vs;
      break;
    case 66:
    case 90:
      keys.sy = keys.sy - vs;
      break;
    case 49:
    case 97:
      keys.rx = keys.rx - rs;
      break;
    case 50:
    case 98:
      keys.rx = keys.rx + rs;
      break;
    case 52:
    case 100:
      keys.ry = keys.ry - rs;
      break;
    case 53:
    case 101:
      keys.ry = keys.ry + rs;
      break;
    case 55:
    case 103:
      keys.rz = keys.rz - rs;
      break;
    case 56:
    case 104:
      keys.rz = keys.rz + rs;
      break;
    case 57:
    case 105:
      keys.sx = keys.sy = keys.sz = 0;
      break;
    case 54:
    case 102:
      keys.rx = keys.ry = keys.rz = 0;
      break;
    case 32:
      keys.reset = true;
      break;
  }
  console.log(e.keyCode, JSON.stringify(keys));
};
