// @author Minxyzgo
// edit/fixed by SITUVNgcd

importPackage(Packages.rhino)
importPackage(Packages.rhino.classfile)
importPackage(Packages.java.lang)
importPackage(Packages.java.lang.reflect)
importPackage(Packages.java.util)

const $ = {}

const CLASS_BODY_PREFIX = "__classBody__"
//$.classBody = new Map()

$.javaToJS = function (obj) {
  return Context.javaToJS(obj, Vars.mods.getScripts().scope)
}

$.toObject = function (obj) {
  return Context.toObject(obj, Vars.mods.getScripts().scope)
}

$.getClass = function (name) {
  let loader = Core.app.class.getClassLoader()
  return java.lang.Class.forName(name, false, loader)
}

function invoke(type, object, name, args, parameterTypes) {
  let method = type.getDeclaredMethod(name, parameterTypes);
  method.setAccessible(true);
  return method.invoke(object, args);
}

const appendTypeString = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "appendTypeString",
    Array.from(arguments),
    [
      StringBuilder.__javaObject__,
      java.lang.Class.__javaObject__
    ])
}

const generateCtor = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateCtor",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.reflect.Constructor.__javaObject__
    ])
}

const generateSerialCtor = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateSerialCtor",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__
    ])
}

const generateEmptyCtor = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateEmptyCtor",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__
    ])
}

const generateMethod = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateMethod",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      $.getClass("[Ljava.lang.Class;"),
      Class.__javaObject__,
      java.lang.Boolean.TYPE
    ])
}

const generateReturnResult = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateReturnResult",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      Class.__javaObject__,
      java.lang.Boolean.TYPE
    ])
}

const generateSuper = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generateSuper",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      java.lang.String.__javaObject__,
      $.getClass("[Ljava.lang.Class;"),
      Class.__javaObject__,
    ])
}

const getMethodSignature = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "getMethodSignature",
    Array.from(arguments),
    [
      Method.__javaObject__,
      $.getClass("[Ljava.lang.Class;")
    ])
}

const getOverridableMethods = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "getOverridableMethods",
    Array.from(arguments),
    [
      java.lang.Class.__javaObject__
    ])
}

const getObjectFunctionNames = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "getObjectFunctionNames",
    Array.from(arguments),
    [
      Scriptable.__javaObject__
    ])
}

const appendMethodSignature = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "appendMethodSignature",
    Array.from(arguments),
    [
      $.getClass("[Ljava.lang.Class;"),
      java.lang.Class.__javaObject__,
      StringBuilder.__javaObject__
    ])
}

const generatePushParam = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generatePushParam",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      java.lang.Integer.TYPE,
      Class.__javaObject__
    ])
}

const generatePushWrappedArgs = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "generatePushWrappedArgs",
    Array.from(arguments),
    [
      ClassFileWriter.__javaObject__,
      $.getClass("[Ljava.lang.Class;"),
      java.lang.Integer.TYPE
    ])
}

const loadAdapterClass = function(){
  return invoke(
    $.getClass("rhino.JavaAdapter"),
    null,
    "loadAdapterClass",
    Array.from(arguments),
    [
      java.lang.String.__javaObject__,
      $.getClass("[B")
    ])
}

/**
* Note: aload_1 will be used as an argument.
*/
function callFunctionDirectly(cfw, className, functionName) {
  // Prepare stack to call method
  // push factory
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, className, "factory",
    "Lrhino/ContextFactory;");

  // push self
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, className, "self",
    "Lrhino/Scriptable;");

  // push function
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, className, "delegee",
    "Lrhino/Scriptable;");
  cfw.addPush(functionName);
  cfw.addInvoke(ByteCode.INVOKESTATIC,
    "rhino/JavaAdapter",
    "getFunction",
    "(Lrhino/Scriptable;"
    + "Ljava/lang/String;"
    + ")Lrhino/Function;");
  cfw.addALoad(1) // Object[]
  cfw.add(ByteCode.LCONST_0)
  cfw.addInvoke(ByteCode.INVOKESTATIC,
    "rhino/JavaAdapter",
    "callMethod",
    "(Lrhino/ContextFactory;"
    + "Lrhino/Scriptable;"
    + "Lrhino/Function;"
    + "[Ljava/lang/Object;"
    + "J"
    + ")Ljava/lang/Object;");
}

function generateGetBody(cfw, className, newFields) {
  // factory// Vars.mods.getScripts().context.getFactory()

  cfw.add(ByteCode.ALOAD_0); // this
  cfw.add(ByteCode.GETSTATIC, "mindustry/Vars", "mods", "Lmindustry/mod/Mods;")
  cfw.addInvoke(ByteCode.INVOKEVIRTUAL, "mindustry/mod/Mods", "getScripts", "()Lmindustry/mod/Scripts;")
  cfw.add(ByteCode.GETFIELD, "mindustry/mod/Scripts", "context", "Lrhino/Context;")
  cfw.addInvoke(ByteCode.INVOKEVIRTUAL, "rhino/Context", "getFactory", "()Lrhino/ContextFactory;")
  cfw.add(ByteCode.PUTFIELD, className, "factory",
    "Lrhino/ContextFactory;");
  cfw.add(ByteCode.ALOAD_0); // this
  cfw.add(ByteCode.GETSTATIC, "mindustry/Vars", "mods", "Lmindustry/mod/Mods;")
  cfw.addInvoke(ByteCode.INVOKEVIRTUAL, "mindustry/mod/Mods", "getScripts", "()Lmindustry/mod/Scripts;")
  cfw.add(ByteCode.GETFIELD, "mindustry/mod/Scripts", "scope", "Lrhino/Scriptable;")
  cfw.addLoadConstant(CLASS_BODY_PREFIX + className)
  cfw.addInvoke(ByteCode.INVOKESTATIC, "rhino/ScriptableObject", "getProperty", "(Lrhino/Scriptable;Ljava/lang/String;)Ljava/lang/Object;")
  cfw.add(ByteCode.PUTFIELD, className, "delegee",
    "Lrhino/Scriptable;");

  cfw.add(ByteCode.ALOAD_0); // this for the following PUTFIELD for self
  cfw.add(ByteCode.ALOAD_0);
  // create a wrapper object to be used as "this" in method calls
  cfw.add(ByteCode.GETFIELD, className, "delegee",
    "Lrhino/Scriptable;"); // the Scriptable delegee
  cfw.add(ByteCode.ALOAD_0); // this
  cfw.addInvoke(ByteCode.INVOKESTATIC,
    "rhino/JavaAdapter",
    "createAdapterWrapper",
    "(Lrhino/Scriptable;"
    + "Ljava/lang/Object;"
    + ")Lrhino/Scriptable;");
  cfw.add(ByteCode.PUTFIELD, className, "self",
    "Lrhino/Scriptable;");

  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, className, "delegee",
    "Lrhino/Scriptable;");
  cfw.addAStore(2)

  // init all fields with default value.
  newFields.forEach(f => {
    cfw.add(ByteCode.ALOAD_0);
    cfw.addALoad(2)
    cfw.addLoadConstant("" + f.fieldName)
    cfw.addALoad(2)
    cfw.addInvoke(ByteCode.INVOKEINTERFACE, "rhino/Scriptable", "get", "(Ljava/lang/String;Lrhino/Scriptable;)Ljava/lang/Object;")
    cfw.add(ByteCode.PUTFIELD, className, f.fieldName,
      f.type); // TODO final check
  })
}

function generateBaseEmptyInitBlock(cfw, className, superName, callafterFunctions) {
  let locals = 3

  cfw.startMethod("__init__",
    "()V",
    ClassFileWriter.ACC_PRIVATE);

  callafterFunctions.forEach(f => {
    cfw.add(ByteCode.GETSTATIC, "mindustry/Vars", "mods", "Lmindustry/mod/Mods;")
    cfw.addInvoke(ByteCode.INVOKEVIRTUAL, "mindustry/mod/Mods", "getScripts", "()Lmindustry/mod/Scripts;")
    cfw.add(ByteCode.GETFIELD, "mindustry/mod/Scripts", "context", "Lrhino/Context;")
    cfw.add(ByteCode.GETSTATIC, "mindustry/Vars", "mods", "Lmindustry/mod/Mods;")
    cfw.addInvoke(ByteCode.INVOKEVIRTUAL, "mindustry/mod/Mods", "getScripts", "()Lmindustry/mod/Scripts;")
    cfw.add(ByteCode.GETFIELD, "mindustry/mod/Scripts", "scope", "Lrhino/Scriptable;")
    let v = f.callafter.substring(10, f.callafter.length)
    cfw.addPush('[' + v.substring(0, v.length - 1) + ']')
    cfw.addLoadConstant(scriptName)
    cfw.add(ByteCode.ICONST_0)
    cfw.addInvoke(ByteCode.INVOKEVIRTUAL,
      "rhino/Context",
      "evaluateString",
      "(Lrhino/Scriptable;"
      + "Ljava/lang/String;"
      + "Ljava/lang/String;"
      + "I"
      + ")Ljava/lang/Object;");
    cfw.addInvoke(ByteCode.INVOKESTATIC,
      "rhino/ScriptRuntime",
      "getArrayElements",
      "(Lrhino/Scriptable;)[Ljava/lang/Object;");
    cfw.addAStore(1)

    /*
    for (let i = 1; i < v.length; i++) {
      cfw.addALoad(1)
      cfw["addPush(int)"](i)
      cfw.add(ByteCode.AALOAD)
      cfw.addAStore(i + 1)
    }

    locals = Math.max(locals, v.length + 3)

    cfw.addALoad(1)
    cfw.add(ByteCode.ICONST_0)
    cfw.add(ByteCode.AALOAD)
    cfw.addAStore(1)
    let sb = new StringBuilder();
    let paramsEnd = appendMethodSignature(f.parms,
      f.returnType,
      sb);

    let methodSignature = sb.toString();
    let paramOffset = 1
    cfw.add(ByteCode.ALOAD_0)
    for (let i = 0; i < f.parms.length; i++) {
      paramOffset += generatePushParam(cfw, paramOffset, f.parms[i]);
    }
    cfw.addInvoke(ByteCode.INVOKEVIRTUAL, className, f.functionName, methodSignature)*/

    callFunctionDirectly(cfw, className, f.functionName)
  })

  cfw.add(ByteCode.RETURN);
  cfw.stopMethod(locals);
}

function generateBaseCtor(cfw, className, superName, newFields, superCtor, jsCtor) {
  let locals = 3; // this + factory + delegee
  let parameters = superCtor.getParameterTypes();

  let sig = new StringBuilder(
    "(");
  
  parameters.forEach(c => {
    appendTypeString(sig, c);
  })
  let marker = sig.length(); // lets us reuse buffer for super signature
  let parms = Array.from(parameters)

  if (jsCtor != undefined) {
    for (let i = 0; i < jsCtor.length - parameters.length; i++) {
      sig.append("Ljava/lang/Object;")
      parms.push(ScriptRuntime.ObjectClass)
    }
  }

  sig.append(")V");
  cfw.startMethod("<init>", sig.toString(), ClassFileWriter.ACC_PUBLIC);

  // Invoke base class constructor
  cfw.add(ByteCode.ALOAD_0); // this
  let paramOffset = 1;
  parameters.forEach(parameter => {
    paramOffset += generatePushParam(cfw, java.lang.Integer(paramOffset), parameter);
  })
  locals = paramOffset + 3;
 // sig.delete(1, marker);
  cfw.addInvoke(ByteCode.INVOKESPECIAL, superName, "<init>", sig.toString().substring(0, marker) + ")V");
  
  generateGetBody(cfw, className, newFields)
  
  cfw.add(ByteCode.ALOAD_0);
  cfw.addInvoke(ByteCode.INVOKESPECIAL, className, "__init__", "()V");

  if (jsCtor != undefined) {
    let parms_java = java.lang.reflect.Array.newInstance(java.lang.Class, parms.length);
    for (let i = 0; i < parms.length; i++) {
      parms_java[i] = parms[i];
    }
    generatePushWrappedArgs(cfw, parms_java, java.lang.Integer(parms.length))
    cfw.addAStore(1)
    callFunctionDirectly(cfw, className, jsCtor.constructorName)
  }

  cfw.add(ByteCode.RETURN);
  cfw.stopMethod(locals);
}


function generateModifierMethod(
  cfw,
  modifier,
  genName,
  methodName,
  parms,
  callafter,
  returnType,
  convertResult
) {
  let sb = new StringBuilder();
  let paramsEnd = appendMethodSignature(parms,
    returnType,
    sb);

  let methodSignature = sb.toString();

  cfw.startMethod(methodName,
    methodSignature,
    java.lang.Short(modifier));

  let label = cfw.acquireLabel()
  if (callafter != undefined) {
    // for now, this + factory + self haven't not been initialized yet, so jump to return null.
    // we will recall this function after initialization.
    cfw.add(ByteCode.ALOAD_0);
    cfw.add(ByteCode.GETFIELD, genName, "self",
      "Lrhino/Scriptable;");
    cfw.add(ByteCode.IFNULL, label)
  }

  // Prepare stack to call method
  // push factory
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, genName, "factory",
    "Lrhino/ContextFactory;");

  // push self
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, genName, "self",
    "Lrhino/Scriptable;");

  // push function
  cfw.add(ByteCode.ALOAD_0);
  cfw.add(ByteCode.GETFIELD, genName, "delegee",
    "Lrhino/Scriptable;");
  cfw.addPush(methodName);
  cfw.addInvoke(ByteCode.INVOKESTATIC,
    "rhino/JavaAdapter",
    "getFunction",
    "(Lrhino/Scriptable;"
    + "Ljava/lang/String;"
    + ")Lrhino/Function;");
  // push arguments
  generatePushWrappedArgs(cfw, parms, java.lang.Integer(parms.length));
  // push bits to indicate which parameters should be wrapped
  if (parms.length > 64) {
    // If it will be an issue, then passing a static boolean array
    // can be an option, but for now using simple bitmask
    throw Context.reportRuntimeError0(
      "JavaAdapter can not subclass methods with more then"
      + " 64 arguments.");
  }


  let convertionMask = 0;
  for (let i = 0; i != parms.length; ++i) {
    if (!parms[i].isPrimitive()) {
      convertionMask = convertionMask | (1 << i);
    }
  }

  cfw["addPush(long)"](convertionMask);

  // cfw.add(ByteCode.LCONST_0)
  // go through utility method, which creates a Context to run the
  // method in.
  cfw.addInvoke(ByteCode.INVOKESTATIC,
    "rhino/JavaAdapter",
    "callMethod",
    "(Lrhino/ContextFactory;"
    + "Lrhino/Scriptable;"
    + "Lrhino/Function;"
    + "[Ljava/lang/Object;"
    + "J"
    + ")Ljava/lang/Object;");

  generateReturnResult(cfw, returnType, convertResult)

  if (callafter != undefined) {
    cfw.markLabel(label)
    cfw.add(ByteCode.ACONST_NULL)
    generateReturnResult(cfw, returnType, convertResult)
  }

  cfw.stopMethod(java.lang.Short(paramsEnd));
}

function createAdapterCode(
  functionNames,
  newConstructors,
  newFunctions,
  newFields,
  className,
  superClass,
  interfaces,
  scriptClassName) {
  let callafterFunctions = []
  let cfw = new ClassFileWriter(className,
    superClass.getName(),
    "<jsClass>");
  cfw.addField("factory", "Lrhino/ContextFactory;",
    (ClassFileWriter.ACC_PRIVATE |
      ClassFileWriter.ACC_FINAL))
  cfw.addField("delegee", "Lrhino/Scriptable;",
    (ClassFileWriter.ACC_PRIVATE |
      ClassFileWriter.ACC_FINAL));
  cfw.addField("self", "Lrhino/Scriptable;",
    (ClassFileWriter.ACC_PRIVATE |
      ClassFileWriter.ACC_FINAL));
  let interfacesCount = interfaces == null ? 0: interfaces.length;
  for (let i = 0; i < interfacesCount; i++) {
    if (interfaces[i] != null)
      cfw.addInterface(interfaces[i].getName());
  }

  let superName = superClass.getName().replace('.', '/');
  // generateSerialCtor(cfw, className, superName);

  let generatedOverrides = new ObjToIntMap();
  let generatedMethods = new ObjToIntMap();

  // generate methods to satisfy all specified interfaces.
  for (let i = 0; i < interfacesCount; i++) {
    let methods = interfaces[i].getMethods();
    for (let i = 0; i < methods.length; i++) {
      let method = methods[i]
      let mods = method.getModifiers();
      if (Modifier.isStatic(mods) || Modifier.isFinal(mods) || method.isDefault()) {
        continue;
      }
      let methodName = method.getName();
      let argTypes = method.getParameterTypes();

      if (!(functionNames.some(f => f.functionName == methodName))) {
        try {
          superClass.getMethod(methodName, argTypes);
          // The class we're extending implements this method and
          // the JavaScript object doesn't have an override. See
          // bug 61226.
          continue;
        }catch(e /*if e.javaException instanceof NoSuchMethodException*/) {
          // Not implemented by superclass; fall through
        }
      }
      // make sure to generate only one instance of a particular
      // method/signature.
      let methodSignature = getMethodSignature(method,
        argTypes);
      let methodKey = methodName + methodSignature;
      if (!(generatedOverrides.indexOf(methodKey) > -1)) {
        generateMethod(cfw, className, methodName, argTypes,
          method.getReturnType(), true);
        generatedOverrides.put(methodKey, 0);
        generatedMethods.put(methodName, 0);
      }
    }
  }

  // Now, go through the superclass's methods, checking for abstract
  // methods or additional methods to override.

  // generate any additional overrides that the object might contain.
  let methods = getOverridableMethods(superClass);

  for (let i = 0; i < methods.length; i++) {
    let method = methods[i]
    let mods = method.getModifiers();
    // if a method is marked abstract, must implement it or the
    // resulting class won't be instantiable. otherwise, if the object
    // has a property of the same name, then an override is intended.
    let isAbstractMethod = Modifier.isAbstract(mods);
    let methodName = method.getName();
    let fun = functionNames.find(f => f.functionName == methodName)
    if (isAbstractMethod || fun != undefined) {
      // make sure to generate only one instance of a particular
      // method/signature.
      let argTypes = method.getParameterTypes();
      let methodSignature = getMethodSignature(method, argTypes);
      let methodKey = methodName + methodSignature;

      if (!generatedOverrides.has(methodKey)) {
        if (fun.callafter != undefined) {
          callafterFunctions.push({
            callafter: fun.callafter,
            functionName: fun.functionName,
            parms: argTypes,
            returnType: method.getReturnType()
          })
        }
        functionNames.splice(functionNames.indexOf(fun), 1)
        generateModifierMethod(cfw, ClassFileWriter.ACC_PUBLIC, className, methodName, argTypes,
          fun.callafter,
          method.getReturnType(), true);
        generatedOverrides.put(methodKey, 0);
        generatedMethods.put(methodName, 0);

        // if a method was overridden, generate a "super$method"
        // which lets the delegate call the superclass' version.
        if (!isAbstractMethod) {
          generateSuper(cfw, className, superName,
            methodName, methodSignature,
            argTypes, method.getReturnType());
        }
      }
    }
  }

  functionNames.forEach(name => {
    throw "function: " + name + " doesn't ovrride anything."
  })

  newFunctions.forEach(f => {
    let length = f.length
    let parms = new Array(length)
    for (let k = 0; k < length; k++)
      parms[k] = ScriptRuntime.ObjectClass;
    let parms_java = java.lang.reflect.Array.newInstance(java.lang.Class, parms.length);
    for (let i = 0; i < parms.length; i++) {
      parms_java[i] = parms[i];
    }
    if (f.callafter != undefined) {
      callafterFunctions.push({
        callafter: f.callafter,
        functionName: f.functionName,
        parms: parms_java,
        returnType: ScriptRuntime.ObjectClass
      })
    }
    generateModifierMethod(cfw, f.flags, className, f.functionName, parms_java, f.callafter,
      ScriptRuntime.ObjectClass, false);
  })
  let fields = superClass.getFields()
  newFields.forEach(f => {
    if (!fields.some(fv => fv.getName() == f.fieldName))
      cfw.addField(f.fieldName, f.type,
      (f.flags))
  })

  generateBaseEmptyInitBlock(cfw,
    className,
    superName,
    callafterFunctions)

  let ctors = superClass.getDeclaredConstructors();
  for (let i = 0; i < ctors.length; i++) {
    let ctor = ctors[i]
    let mod = ctor.getModifiers();
    let parms = ctor.getParameterTypes()
    newConstructors.forEach(v => {
      let vi = v.superBody.substring(6, v.superBody.length)
      let arr = eval('[' + vi.substring(0, vi.length - 1) + ']')
      //  print("arr: " + arr.join(","))
      //  print("parms: " + parms.join(","))
      if (arr.length != parms.length) return
      for (let i = 0; i < arr.length; i++) {
        //print("arr[" + i + "]=" + arr[i].__javaObject__.getName() + " ,parms[" + i + "]=" + parms[i].getName())
        if (arr[i].__javaObject__.getName() != parms[i].getName()) return
      }
      if (Modifier.isPublic(mod) || Modifier.isProtected(mod)) {
        generateBaseCtor(cfw, className, superName, newFields, ctor, v);
        newConstructors.splice(newConstructors.indexOf(v), 1)
      }
    })

    if (Modifier.isPublic(mod) || Modifier.isProtected(mod)) {
      generateBaseCtor(cfw, className, superName, newFields, ctor);
    }
  }

  newConstructors.forEach(c => {
    throw "Illegal constructor: " + c.constructorName + " " + c.superBody
  })

  return cfw.toByteArray();
}

let classLoader;
$.defineClass = function (/*className, superclass, interfaces..., body*/) {
  let className = arguments[0]
  let body = arguments[arguments.length - 1]
  let generatedFunctions = []
  let generatedFields = []
  let generatedConstructors = []
  let callafterFunctions = []
  let overrideFunctions = []
  let args = ["public",
    "protected",
    "private",
    "override"]
  let expandObject = {}
  args.forEach(mod => {
    if (body.hasOwnProperty(mod)) {
      Object.keys(body[mod]).forEach(key => {
        let v = body[mod][key]
        let flag = mod == "override" ? null: Reflect.get(ClassFileWriter, null, "ACC_" + mod.toUpperCase())
        let identifiers = key.trim().split(' ')
        let callafterBody = identifiers.find(k => k.startsWith("callafter"))
        let superBody = identifiers.find(k => k.startsWith("super"))

        function checkInvalidCallafterIdentifier() {
          if (callafterBody != undefined) throw "You cannot use identifier 'callafter' here."
        }

        function checkInvalidSuperIdentifier() {
          if (superBody != undefined) throw "You cannot use identifier 'super' here."
        }

        let name = identifiers[identifiers.length - 1]
        if (name == "constructor" || name.startsWith("constructor$")) {
          checkInvalidCallafterIdentifier()
          generatedConstructors.push({
            flags: flag,
            length: v.length,
            superBody: superBody == undefined ? "super()": superBody,
            constructorName: name
          })

          expandObject[name] = v
        } else if (typeof(v) == "function") {
          checkInvalidSuperIdentifier()
          if (mod == "override") {
            overrideFunctions.push({
              length: v.length,
              callafter: callafterBody,
              functionName: name
            })
          } else {
            generatedFunctions.push({
              flags: flag,
              length: v.length,
              callafter: callafterBody,
              functionName: name
            })
          }

          expandObject[name] = v
        } else {
          checkInvalidSuperIdentifier()
          checkInvalidCallafterIdentifier()
          if (mod == "override") throw "You cannot define a field in the override block."
          generatedFields.push({
            flags: flag,
            type: "Ljava/lang/Object;",
            fieldName: key
          })
          expandObject[key] = v
        }
      })
    }
  })

  Object.keys(body).forEach(tag => {
    if (!args.some(k => k == tag)) throw "unknown tag: " + tag
  })
  let superClass = arguments.length > 2 ? arguments[1] : ScriptRuntime.ObjectClass;
  if(!(superClass instanceof java.lang.Class)){
    superClass = superClass.__javaObject__;
  }
  let interfaces = arguments.length > 3 ? Array.from(arguments).splice(2, arguments.length - 3): [];
  let code = createAdapterCode(
    overrideFunctions,
    generatedConstructors,
    generatedFunctions,
    generatedFields,
    className,
    superClass,
    interfaces,
    null
  )

  //let clazz = loadAdapterClass(className, code);
  if(!classLoader){
    let ml = Vars.mods.mainLoader();
    classLoader = Vars.mods.getScripts().context.createClassLoader(ml);
    ml.addChild(classLoader);
  }
  let clazz = classLoader.defineClass(className, code);
  classLoader.linkClass(clazz);
  ScriptableObject.putConstProperty(Vars.mods.getScripts().scope,
    CLASS_BODY_PREFIX + className,
    expandObject);
  //  $.classBody.set(className, expandObject)
  return NativeJavaClass(Vars.mods.getScripts().scope, clazz);
}

/* Use new expr instead
$.newClassInstance = function (class, ...args) {
  let cx = Vars.mods.getScripts().context
  let ctorParms = [
    ScriptRuntime.ScriptableClass,
    ScriptRuntime.ContextFactoryClass
  ];
  let body = $.classBody.get(arguments[0].name)
  let ctorArgs = [Object.assign(body, arguments.length > 1 ? arguments[1]: {}),
    cx.getFactory()];
  return arguments[0].getConstructor(ctorParms).newInstance(ctorArgs);
}
*/
global.svn.cd = $;
//global.module.exports = $
