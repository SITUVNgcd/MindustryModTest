try{
  importPackage(Packages.java.lang);
  importPackage(Packages.java.lang.reflect);
  const EMPTY = "";
  global.svn.util = {};
  global.svn.util.call = function(obj, mName){
    let to, cl = null;
    try{
      to = new obj();
      if(to instanceof java.lang.Object){
        cl = to.getClass();
      }
    }catch(e){}
    if(!obj || (!cl && !(obj instanceof java.lang.Object)) || typeof mName != "string" || mName == ""){
      return  {stt: {name: "invalidObject", code: -2}, val: undefined};
    }
    let args = [], a = arguments;
    for(let i = 2; i < a.length; ++i){
      args.push(a[i]);
    }
    let clz;
    if(cl != null){
      clz = cl;
      obj = null;
    }else{
      clz = obj.getClass();
    }
    let ms, mt, acc, res, exc = {};
    while(clz){
      ms = clz.getDeclaredMethods();
      for(let i = 0; i < ms.length; ++i){
        try{
          mt = ms[i];
          if(mt.getName() != mName){
            continue;
          }
          acc = mt.isAccessible();
          mt.setAccessible(true);
          try{
            res = mt.invoke(obj, args);
            exc = null;
          }catch(e){
            exc = e;
          }
          mt.setAccessible(acc);
          if(exc == null){
            return {stt: {name: "ok", code: 0}, val: res};
          }else if(exc instanceof InvocationTargetException){
            return {stt: {name: "exception", code: 1}, val: exc.getTargetException()};
          }
        }catch(e){
          Log.err("util call: " + e);
        }
      }
      clz = clz.getSuperclass();
    }
    return {stt: {name: "noMethod", code: -1}, val: undefined};
  }
  
  global.svn.util.field = function(obj, fName, val){
    let to, cl = null;
    try{
      to = new obj();
      if(to instanceof java.lang.Object){
        cl = to.getClass();
      }
    }catch(e){}
    if(!obj || (!cl && !(obj instanceof java.lang.Object)) || typeof fName != "string" || fName == ""){
      return  {stt: {name: "invalidObject", code: -2}, val: undefined};
    }
    let clz;
    if(cl != null){
      clz = cl;
      obj = null;
    }else{
      clz = obj.getClass();
    }
    let fs, fi, acc, res, exc = {};
    while(clz){
      fs = clz.getDeclaredFields();
      for(let i = 0; i < fs.length; ++i){
        try{
          fi = fs[i];
          if(fi.getName() != fName){
            continue;
          }
          acc = fi.isAccessible();
          fi.setAccessible(true);
          try{
            if(arguments.length > 2){
              try{
                fi.set(obj, val);
              }catch(e){
                exc = e;
              }
            }
            res = fi.get(obj);
            exc = null;
          }catch(e){
            exc = e;
          }
          fi.setAccessible(acc);
          if(exc == null){
            return {stt: {name: "ok", code: 0}, val: res};
          }else{
            return {stt: {name: "exception", code: 1}, val: exc};
          }
        }catch(e){
          Log.err("util field: " + e);
        }
      }
      clz = clz.getSuperclass();
    }
    return {stt: {name: "noField", code: -1}, val: undefined};
  }
  
  let st = function(c){
    if(c instanceof Color){
      c = c.toString();
    }
    if(typeof c == "number" && Number.isInteger(c)){
      c = c.toString(16).padStart(8, "0");
    }
    if(typeof c == "string"){
      if(c.indexOf("#") == 0){
        c = c.substring(1);
      }
      return c;
    }
    return null;
  }
  let gcn = function(c){
    c = st(c);
    if(c && typeof c == "string"){
      if(arguments.length > 1){
        let cl, k, v;
        let arg = arguments;
        for(let i = 1; i < arg.length; ++i){
          cl = arg[i];
          if(!cl){
            continue;
          }
          for(k in cl){
            if(k == c){
              return k;
            }
            v = cl[k];
            if(v && v instanceof Color && v.toString() == c){
              return k;
            }
          }
        }
      }
    }
    return null;
  }
  global.svn.util.colorString = function(cs, def){
    let cn = gcn(cs, Color, Pal);
    if(cn != null){
      return cn;
    }
    cs = st(cs);
    if(cs && typeof cs == "string"){
      let s = new java.lang.String(cs);
      let cc = s.matches("[0-9a-fA-F]{1,8}");
      if(cc){
        cs = "#" + cs;
        return cs;
      }
    }
    if(typeof def != "string"){
      def = "";
    }
    return def;
  }
  
  global.svn.util.extend = function(){
    const args = arguments, len = agrs.length;
    let res, i, p, arg;
    if(len > 0 && typeof args[0] == "object" && !(args[0] instanceof java.lang.Object)){
      res = args[0];
      for(i = 1; i < len; ++i){
        arg = args[i];
        if(typeof arg != "object" || arg instanceof java.lang.Object){
          continue;
        }
        for(p in arg){
          res[p] = arg[p];
        }
      }
    }
    return res;
  }
  
  
  let json = function(o, func, ind, str, max, uo, name){
    if(!(uo instanceof Array)){
      uo = [];
    }
    if(!name){
      name = "<root>";
    }
    let r = "";
    const ot = typeof o;
    if(o == undefined){
      r = "undefined";
    }else if(o == null){
      r = "null";
    }else if(ot == "function"){
      r = "function";
    }else if(ot == "boolean" || ot == "number"){
      r = func(o);
    }else if(ot == "bigint"){
      r = func(o).toString();
    }else if(ot == "string" || o instanceof Packages.rhino.ConsString){
      r = "\"" + func(o).toString().replace(/\"/gi, "\\\"") + "\"";
    }else if(o instanceof Date){
      r = func(o).toString();
    }else if(ot == "object"){
      o = func(o); // too many call to func(o); f*ck!
      let cr = null;
      let io;
      for(let i = 0; i < uo.length; ++i){
        io = uo[i];
        if(io.obj == o){
          cr = io;
        }
      }
      if(cr != null){
        if(o instanceof java.lang.Object){
          r += "class " + o.getClass().getName();
        }
        r += "(";
        if(cr.lvl < ind){
          r += "Circular reference";
        }else{
          r += "Reference";
        }
        r += ":\"" + cr.name + "\")";
      }else{
        uo.push({name: name, lvl: ind, obj: o});
        let indent = str ? "\n" + str.repeat(ind) : "";
        let indent1 = str ? "\n" + str.repeat(ind + 1) : "";
        if(o instanceof java.lang.Object){
          r += "class " + o.getClass().getName();
          // How about Java Array???
          if(ind <= max){
            let ps = [];
            r += "{";
            for(let i in o){
                ps.push(indent1 + i + ":" + json(o[i], func, ind + 1, str, max, uo, name + "." + i));
            }
            r += ps.join(", ");
            if(ps.length){
              r += indent;
            }
            r += "}";
          }
        }else{
          if(o instanceof Array){
            r += "[";
            if(ind <= max){
              let ps = [];
              for(let i = 0; i < o.length; ++i){
                ps.push(indent1 + "" + json(o[i], func, ind + 1, str, max, uo, name + "." + i));
              }
              r += ps.join(", ");
              if(ps.length){
                r += indent;
              }
            }
            r += "]";
          }else if(o instanceof Object){
            r += "{";
            if(ind <= max){
              let ns = Object.getOwnPropertyNames(o);
              let ps = [];
              for(let i of ns){
                ps.push(indent1 + i + ":" + json(o[i], func, ind + 1, str, max, uo, name + "." + i));
              }
              r += ps.join(", ");
              if(ps.length){
                r += indent;
              }
            }
            r += "}";
          }
        }
      }
    }else{
      r = ot;
    }
    return r;
  }
  const DEFFUNC = o=>o;
  let toJSON = function(o, f, i, max){
    if(typeof f != "function"){
      f = DEFFUNC;
    }
    let it = typeof i;
    let s = " ";
    if(it == "string"){
      s = i;
    }else if(it == "number"){
      if(i < 0){
        i = 2;
      }
      s = s.repeat(i);
    }else{
      s = "";
    }
    i = 0;
    if(typeof max != "number" || max < 0){
      max = 0; // Number.MAX_VALUE; Nah, Stackoverflow
    }
    return json(o, f, i, s, max);
  }
  global.svn.util.toJson= function(o, f, i, max){
    return toJSON(o, f, i, max);
  }
  
  let ip, port;
  Events.on(EventType.ClientServerConnectEvent, e=>{
    ip = e.ip; port = e.port;
  });
  global.svn.util.getIp = function(){
    if(Vars.net.active()){
      if(!ip){
        ip = global.svn.util.field(Vars.ui.join, "lastIp").val;
      }
      return ip;
    }
    return "";
  }
  global.svn.util.getPort = function(){
    if(Vars.net.active()){
      if(!port){
        port = global.svn.util.field(Vars.ui.join, "lastPort").val;
      }
      return port;
    }
    return 0;
  }
  
  global.svn.util.hud = function(){
    return Vars.ui.hudfrag.shown;
  }
  global.svn.util.net = function(){
    return Vars.net.active();
  }
  
  const setTouchable = function(e, t, lvl){
    if(!(e instanceof Element) || !(t instanceof Touchable)){
      return false;
    }
    if(typeof lvl != "number"){
      lvl = Number.MAX_SAFE_INTEGER;
    }
    if(lvl < 0){
      return false;
    }
    if(lvl > 0 && e instanceof Group){
      e.getChildren().each(v=>{
        setTouchable(v, t, lvl - 1);
      });
    }
    e.touchable = t;
    return true;
  }
  global.svn.util.setTouchable = setTouchable;
  
  const listChar = function(beg, end){
    let res = "";
    for(let i = beg; i <= end; ++i){
      res += String.fromCharCode(i);
    }
    return res;
  }
  global.svn.util.listChar = listChar;
  
  const addAllUniqueR = function(s, t){
    if(!(s instanceof Seq) || !(t instanceof Seq)) return null;
    let r = new Seq();
    t.each(u=>{
      if(s.addUnique(u)){
        r.add(u);
      }
    });
    return r;
  }
  const addAllUnique = function(s, t){
    if(!(s instanceof Seq) || !(t instanceof Seq)) return false;
    t.each(u=>{
      s.addUnique(u);
    });
    return true;
  }
  global.svn.util.addAllUniqueR = addAllUniqueR;
  global.svn.util.addAllUnique = addAllUnique;
  
  (function(){
    const que = new Seq(), it;
    let scmClear = false;
    let last = System.currentTimeMillis(), cur;
    let thr;
    const send = function(msg){
      Call.sendChatMessage(msg);
      last = System.currentTimeMillis();
    }
    const runSCM = function(){
      while(que.size > 0){
        it = que.first();
        que.remove(0);
        cur = System.currentTimeMillis();
        if(cur - last >= it.dl){
          send(msg);
        }else{
          Thread.sleep(it.dl + last - cur);
          if(!scmClear){
            send(it.msg);
          }
        }
      }
    }
    const sendChatMessage = function(msg, dl){
      if(arguments.length > 0){
        scmClear = false;
        if(typeof dl != "number"){
          dl = 0;
        }
        cur = System.currentTimeMillis();
        if(que.size == 0 && (cur - last) >= dl){
          send(msg);
        }else{
          que.add({msg: msg, dl: dl});
          if(!thr || !(thr instanceof Thread) || !thr.alive){
            thr = new Thread(runSCM, "svn.util.scm");
            thr.setDaemon(true);
            thr.start();
          }
        }
      }
    }
    const sendChatMessageClear = function(){
      que.clear();
      scmClear = true;
    }
    global.svn.util.sendChatMessage = sendChatMessage;
    global.svn.util.sendChatMessageClear = sendChatMessageClear;
  })();
}catch(e){
  Log.err(module.id + ": " + e);
}