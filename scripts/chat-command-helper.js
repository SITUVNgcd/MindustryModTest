try{
  global.svn.cch = {};
  const types = {
    boolean: false,
    number: 0;
    string: "",
    unit: Vars.content.units(),
    block: Vars.content.blocks(),
    item: Vars.content.items(),
    liquid: Vars.content.liquids(),
    player: Groups.player,
    team: Team.all,
    date: Date,
  }
  let parse = function(){
    let args = arguments, len = args.length, cmd, i, cmds = [];
    if(typeof args[0] == "string"){
      cmd = [];
      args[0] = args[0].replace(/\//gi, "");
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
    const self = this;
    const args = arguments;
    const w = new WidgetGroup();
    w.touchable = Touchable.childrenOnly;
    w.update(()=>{
      w.setSize(w.parent ? w.parent.getWidth() : 0, 50);
      w.pack();
    });
    const at = typeof args[0];
    const cmds = parse.apply(null, args), cmdt = [], selectedCmd = 0;
    const clk = ()=>{
      let i = self.selectedCmd, len = self.cmds.length;
      i = (i + 1 + len) % len;
      self.setSelectedCmd(i);
    }
    for(let i = 0; i < cmds.length; ++i){
      let ii = i;
      let cmd = cmds[i];
      let tmp = new Table(Styles.black3);
      tmp.top().left();
      tmp.update(()=>{
        if(tmp.parent){
          tmp.setHeight(tmp.parent.getHeight());
        }
        tmp.pack();
      });
      tmp.setPosition(0, 0, Align.topLeft);
      tmp.visibility = ()=>this.selectedCmd == ii;
      const lbl = tmp.add("/" + cmd[0]).expand().padLeft(6).get();
      lbl.clicked(clk);
      tmp.name = cmd[0];
      tmp.table(Styles.none, args=>{
        for(let j = 1; j < cmd.length; ++j){
          let arg = cmd[j];
          args.button(arg, ()=>{
            
          }).expand().padLeft(6).name(arg);
        }
      }).expand().top().left();
      w.addChild(tmp);
      cmdt.push(tmp);
    }
    w.pack();
    Object.defineProperty(this, "w", {value: w, writable: false});
    Object.defineProperty(this, "cmds", {value: cmds, writable: false});
    Object.defineProperty(this, "cmdt", {value: cmdt, writable: false});
    Object.defineProperty(this, "selectedCmd", {value: selectedCmd, writable: true});
  }
  CCH.prototype.setSelectedCmd = function(val){
    const vt = typeof val;
    if(vt == "number" && val >= 0 && val < this.cmds.length){
      this.selectedCmd = val;
    }else if(vt == "string"){
      val = val.replace(/\//gi, "");
      let cmds = this.cmds, len = cmds.length, cmd;
      for(let i = 0; i < len; ++i){
        cmd = cmds[i];
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
  
  CCH.prototype.send = function(){
    let msg = "?";
    Events.fire(new EventType.ClientChatEvent(msg));
    Call.sendChatMessage(msg);
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