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
    let ms = obj.getClass().getDeclaredMethods();
    let mt, acc, exc;
    for(let i = 0; i < ms.length; ++i){
      exc = null;
      try{
        mt = ms[i];
        if(mt.getName() != mName){
          continue;
        }
        acc = mt.getAccessible();
        mt.setAccessible(true);
        try{
          r = mt.invoke(obj, args);
        }catch(e){
          exc = e;
        }
        mt.setAccessible(acc);
        if(exc == null){
          return r;
        }
      }catch(e){
        exc = e;
      }
      if(exc != null && exc instanceof InvocationTargetException){
        throw exc.getTargetException();
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
  
  let gcn = function(c){
    if(c instanceof Color){
      c = c.toString();
    }
    if(typeof c == "number" && Number.isInteget(c)){
      c = c.toString(16).padStart(8, "0");
    }
    if(typeof c == "string"){
      if(c.indexOf("#") == 0){
        c = c.substring(1);
      }
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
      return c;
    }
    return null;
  }
  
  global.svn.util.colorString = function(cs, def){
    cs = gcn(cs, Color, Pal);
    if(cs && typeof cs == "string"){
      let s = new java.lang.String(cs);
      let cc = s.matches("[0-9a-fA-F]{8}");
      if(cc){
        cs = "#" + cs;
      }
      return cs;
    }
    if(typeof def != "string"){
      def = "white";
    }
    return def;
  }
}catch(e){
  Log.err("util: " + e);
}