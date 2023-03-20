try{
  importPackage(Packages.java.lang);
  importPackage(Packages.java.lang.reflect);
  let u = {};
  u.call = function(obj, mName){
    if(!obj || typeof mName != "string" || mName == ""){
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
  
  u.field = function(obj, fname, val){
    if(!obj || typeof fName != "string" || fName == ""){
      return;
    }
    if(arguments.length > 2){ // set value
      
    }
  }
  global.utils = u;
}catch(e){
  Log.err("utils: " + e);
}