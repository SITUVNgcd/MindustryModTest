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
    let ms = clz.getDeclaredMethods();
    let mt, acc, res, exc = {};
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
    let fs = clz.getDeclaredFields();
    let fi, acc, res, exc = {};
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
  
  let json = function(o, func, ind, str, uo){
    if(!(uo instanceof Array)){
      uo = [];
    }
    let r = "";
    const ot = typeof o;
    if(o == undefined){
      r = "undefined";
    }else if(o == null){
      r = "null";
    }else if(ot == "function"){
      r = "function " + o.name;
    }else if(ot == "boolean" || ot == "number"){
      r = o;
    }else if(ot == "bigint"){
      r = o.toString();
    }else if(ot == "string"){
      r = JSON.stringify(o);
    }else if(o instanceof Date){
      r = o.toString();
    }else if(ot == "object"){
      if(uo.indexOf(o) != -1){
        r = "Circular reference";
      }else{
        uo.push(o);
        let indent = str ? "\n" + str.repeat(i) : null;
        if(o instanceof java.lang.Object){
          
        }else{
          if(o instanceof Array){
            r += "[";
            for(let i = 0; i < o.length; ++i){
              r += i + ":" + json(o[i], func, ind + 1, str, uo) + ",";
            }
            if(o.length > 0){
              r = r.substring(0, r.length - 1);
            }
            r += "]";
          }else if(o instanceof Object){
            
          }
        }
      }
    }else{
      r = ot;
    }
    return r;
  }
  let toJSON = function(o, f, i){
    let it = tyoeof i;
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
    return json(o, f, i, s, []);
  }
  global.svn.util.string = function(o){
    if(o == undefined){
      o = "undefined";
    }else if(o == null){
      o = "null";
    }else if(typeof o == "bigint"){
      o = (o.toJSON || o.toString)();
    }else if(typeof o == "function"){
      o == "function" + o.name;
    }else if(typeof o == "string"){
      o = o; // ???
    }else{
      try{
        o = JSON.stringify(o, null, 2);
      }catch(e){
        o = o.toString();
      }
    }
    return o;
  }
}catch(e){
  Log.err("util: " + e);
}