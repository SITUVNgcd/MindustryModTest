try{
  global.svn.cch = {};
  
  let parse = function(){
    let args = arguments, len = args.length, cmd, i, cmds = [];
    if(typeof args[0] == "string"){
      cmd = [];
      if(args[0].indexOf("/") == 0){
        args[0] = args[0].substring(1);
      }
      cmd.push(args[0]);
      for(i = 1; i < len; ++i){
        cmd.push(args[i]);
      }
      cmds.push(cmd);
    }else if(args[0] instanceof Array){
      for(i = 0; i < len; ++i){
        cmd = parse.apply(null, args[i]);
        if(cmd.length > 0){
          cmds.push(cmd[0]);
        }
      }
    }
    return cmds;
  }
  let CCH = function(){
    const args = arguments;
    const tbl = new Table(Styles.black3);
    tbl.touchable = Touchable.enabled;
    const at = typeof args[0];
    const cmds = parse.apply(null, args), cmdt = [], selectedCmd = 0;
    let tmp, cmd;
    for(let i = 0; i < cmds.length; ++i){
      cmd = cmds[i];
      tmp = new Table();
      tmp.visibility = ()=>this.selectedCmd == i;
      tmp.add("/" + cmd[0]);
      tmp.table(args=>{
        for(let j = 1; j < cmd.length; ++j){
          let arg = cmd[j];
          args.button(arg, ()=>{
            
          });
        }
      });
      tbl.add(tmp);
      cmdt.push(tmp);
    }
    Object.defineProperty(this, "tbl", {value: tbl, writable: false});
    Object.defineProperty(this, "cmds", {value: cmds, writable: false});
    Object.defineProperty(this, "cmdt", {value: cmdt, writable: false});
    Object.defineProperty(this, "selectedCmd", {value: selectedCmd, writable: false});
  }
  CCH.prototype.setSelectedCmd = function(val){
    const vt = typeof val;
    if(vt == "number" && val >= 0 && val < this.cmds.length){
      this.selectedCmd = val;
    }else if(vt == "string"){
      if(val.indexOf("/") == 0){
        val = val.substring(1);
      }
      let cmds = this.cmds, len = cmds.length, cmd;
      for(let i = 0; i < len; ++i){
        cmd = cmds[0];
        if(val == cmd[0]){
          this.selectedCmd = i;
          break;
        }
      }
    }
    return this.selectedCmd;
  }
  CCH.prototype.addCmd = function(){
    
  }
  CCH.prototype.getValue = function(){
    
  }
  
  let CCX = function(args){
    return CCH.apply(this, args);
  }
  CCX.prototype = CCH.prototype;
  
  global.svn.cch.create = function() {
      const res = new CCX(arguments);
      return res;
  }
  
}catch(e){
  Log.err("chat-command: " + e);
}