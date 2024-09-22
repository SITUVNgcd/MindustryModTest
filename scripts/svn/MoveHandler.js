const clazz = global.svn.cd.defineClass("svn.MoveHandler", DragListener, {
  private: {
    target: null
  },
  public: {
    constructor(target){
      this.target = target;
    }
  },
  override: {
    dragStart: function(e, x, y, p){
      
    },
    drag: function(e, x, y, p){
      try{
          let t = e.targetActor;
          (this.target || e.listenerActor).moveBy(this.getStageDeltaX(), this.getStageDeltaY());
      }catch(e){
        Log.err(e);
      }
    },
    dragStop: function(e, x, y, p){
      try{
        if(typeof done === "function" && (!done.__javaObject__ || !(done.__javaObject__ instanceof java.lang.Class))){
          done();
        }
      }catch(e){
        Log.err(e);
      }
    }
  }
});

global.svn.cls = (global.svn.cls || {});
global.svn.cls.MoveHandler = clazz;
module.exports = clazz;