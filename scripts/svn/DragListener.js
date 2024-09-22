const clazz = global.svn.cd.defineClass("svn.DragListener", InputListener, {
  private: {
    _tapSquareSize: 14,
    _touchDownX: -1, _touchDownY: -1,
    _stageTouchDownX: -1, _stageTouchDownY: -1,
    _pressedPointer: -1,
    _button: -1,
    _dragging: false,
    _deltaX: 0, _deltaY: 0,
    _stageDeltaX: 0, _stageDeltaY: 0
  },
  public: {
    constructor(t){
      this._target = t;
    },
    dragStart(e, x, y, p){
      
    },
    drag(e, x, y, p){
      
    },
    dragStop(e, x, y, p){
      
    },
    cancel(){
      this._dragging = false;
      this._pressedPointer = -1;
    },
    isDragging(){
      return this._dragging;
    },
    getTapSquareSize(){
      return this._tapSquareSize;
    },
    setTapSquareSize(halfTapSquareSize){
      this._tapSquareSize = halfTapSquareSize;
    },
    getTouchDownX(){
      return this._touchDownX;
    },
    getTouchDownY(){
      return this._touchDownY;
    },
    getStageTouchDownX(){
      return this._stageTouchDownX;
    },
    getStageTouchDownY(){
      return this._stageTouchDownY;
    },
    getDeltaX(){
      return this._deltaX;
    },
    getDeltaY(){
      return this._deltaY;
    },
    getStageDeltaX(){
      return this._stageDeltaX;
    },
    getStageDeltaY(){
      return this._stageDeltaY;
    },
    getButton(){
      return this._button;
    },
    setButton(button){
      this._button = button;
    }
  },
  override: {
    touchDown(event, x, y, pointer, button){
      if(this._pressedPointer != -1) return false;
      if(pointer == 0 && this._button != -1 && button != this._button) return false;
      this._pressedPointer = pointer;
      this._touchDownX = x;
      this._touchDownY = y;
      this._stageTouchDownX = event.stageX;
      this._stageTouchDownY = event.stageY;
      event.handle();
      return true;
    },
    touchDragged(event, x, y, pointer){
        if(pointer != this._pressedPointer) return;
        if(!this._dragging && (Math.abs(this._stageTouchDownX - event.stageX) > this._tapSquareSize || Math.abs(this._stageTouchDownY - event.stageY) > this._tapSquareSize)){
            this._dragging = true;
            this.dragStart(event, x, y, pointer);
            this._deltaX = x;
            this._deltaY = y;
            this._stageDeltaX = event.stageX;
            this._stageDeltaY = event.stageY;
        }
        if(this._dragging){
            this._deltaX = x - this._deltaX;
            this._deltaY = y - this._deltaY;
            this._stageDeltaX = event.stageX - this._stageDeltaX;
            this._stageDeltaY = event.stageY - this._stageDeltaY;
            this.drag(event, x, y, pointer);
            this._deltaX = x;
            this._deltaY = y;
            this._stageDeltaX = event.stageX;
            this._stageDeltaY = event.stageY;
        }
    },
    touchUp(event, x, y, pointer, button){
      if(pointer == this._pressedPointer){
          if(this._dragging) this.dragStop(event, x, y, pointer);
          this.cancel();
          event.handle();
      }
    }
  }
});
global.svn.cls = (global.svn.cls || {});
global.svn.cls.DragListener = clazz;
module.exports = clazz;