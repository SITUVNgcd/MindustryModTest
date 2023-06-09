try{
  global.svn.evt = {};
  const EventListener = function(){
    Object.defineProperty(this, "l", {value: new Map(), writable: false});
  }
  EventListener.prototype.add = function(t, cb){
    if(!(cb instanceof Function)){
      return false;
    }
    let cbl;
    if(this.l.has(t)){
      cbl = this.l.get(t);
    }
    if(!cbl || !(cbl instanceof Set)){
      cbl = new Set();
      this.l.set(t, cbl);
    }
    return cbl.add(cb);
  }
  EventListener.prototype.remove = function(t, cb){
    if(arguments.length > 1 && this.l.has(t)){
      const cbl = this.l.get(t);
      if(cbl && cbl instanceof Set){
        return cbl.delete(cb);
      }
    }else if(arguments.length > 0){
      return this.delete(t);
    }
    return false;
  }
  EventListener.prototype.dispatch = function(t, self){
    if(arguments.length > 0 && this.l.has(t)){
      let cbl = this.l.get(t);
      let r = true;
      let args = [];
      for(let i = 2; i < arguments.length; ++i){
        args.push(arguments[i]);
      }
      for(let cb of cbl){
        if(cb instanceof Function){
          r = cb.apply(self, args) && r;
        }
      }
      return r;
    }
    return false;
  }
  EventListener.prototype.clear = function(t){
    if(arguments.length > 0 && this.l.has(t)){
      const cbl = this.l.get(t);
      if(cbl && cbl instanceof Set){
        //cbl.clear(); // js Rhino NativeSet issue on Set.clear
        cbl.forEach(v=>{
          cbl.delete(v);
        });
      }
    }else{
        //this.l.clear(); // js Rhino NativeMap issue on Map.clear
        this.l.forEach((v, k, m)=>{
          m.delete(k);
        });
    }
  }
  global.svn.evt.EventListener = EventListener;
  global.svn.evt.def = new EventListener();
}catch(e){
  Log.err(module.id + ": " + e);
}