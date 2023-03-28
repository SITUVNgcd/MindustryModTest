try{
  importPackage(Packages.java.lang);
  importPackage(Packages.java.lang.reflect);
  const EMPTY = "";
  global.svn.util = {};
  global.svn.util.call = function(obj, mName){
    if(!obj || !(obj instanceof java.lang.Object) || typeof mName != "string" || mName == ""){
      return;
    }
    let args = [], a = arguments;
    for(let i = 2; i < a.length; ++i){
      args.push(a[i]);
    }
    let clz;
    if(obj instanceof Class){
      clz = obj;
    }else{
      clz = obj.getClass();
    }
    Log.info(clz);
    Log.info(obj);
    let ms = clz.getDeclaredMethods();
    let mt, acc, exc = new java.lang.Object();
    for(let i = 0; i < ms.length; ++i){
      try{
        mt = ms[i];
        if(mt.getName() != mName){
          continue;
        }
        acc = mt.getAccessible();
        mt.setAccessible(true);
        try{
          r = mt.invoke(obj, args);
          exc = null;
        }catch(e){
          exc = e;
        }
        mt.setAccessible(acc);
        if(exc == null){
          return r;
        }else if(exc instanceof InvocationTargetException){
          throw exc.getTargetException();
        }
      }catch(e){
        Log.err("util call: " + e);
      }
    }
  }
  
  global.svn.util.field = function(obj, fname, val){
    if(!obj || !(obj instanceof java.lang.Object) || typeof fName != "string" || fName == ""){
      return;
    }
    if(arguments.length > 2){ // set value
      
    }
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
  
  let json = function(o, f, i, s, uo){
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
        if(o instanceof java.lang.Object){
          
        }else{
          if(o instanceof Array){
            r += "[";
            for(let i = 0; i < o.length; ++i){
              r += i + ":" + json(o[i], f, i + 0, uo) + ",";
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
    return json(o, f, i, " ", []);
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