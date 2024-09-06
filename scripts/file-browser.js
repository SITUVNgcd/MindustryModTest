try{
  global.svn.fb = {};
  global.svn.evt.load(()=>{
    const flati = global.svn.styles.flati, flatt = global.svn.styles.flatt;
    const root = Vars.dataDirectory;
    const rootPath = root.path();
    const checkRev = function(rev){
      return rev ? -1 : 1;
    }
    const sortName = function(fis, rev){
      rev = checkRev(rev);
      return fis["sort(java.util.Comparator)"]((a, b)=>rev * new java.lang.String(a.name()).compareToIgnoreCase(b.name()));
    }
    const sortExt = function(fis, rev){
      rev = checkRev(rev);
      return fis["sort(java.util.Comparator)"]((a, b)=>rev * new java.lang.String(a.extension()).compareToIgnoreCase(b.extension()));
    }
    const sortType = function(fis, rev){
      rev = checkRev(rev);
      return fis["sort(arc.func.Floatf)"](f=>rev * (f.isDirectory() ? 0 : 1));
    }
    const sortLastModified = function(fis, rev){
      rev = checkRev(rev);
      return fis["sort(arc.func.Floatf)"](f=>rev * f.lastModified());
    }
    const toString = function(fis, abs, ico){
      if(!fis || !(fis instanceof Fi) && !(fis instanceof Seq)){
        return;
      }
      if(typeof abs !== "boolean"){
        abs = true;
      }
      if(typeof ico !== "boolean"){
        ico = true;
      }
      if(fis && fis instanceof Fi && fis.isDirectory()){
        fis = fis.seq();
      }
      let r = "";
      fis.each(f=>{
        if(f instanceof Fi){
          r += (ico ? (f.isDirectory() ? "" : "" ) : "");
          r += (abs ? f.path().substring(rootPath.length) : f.path()) + "\n";
        }
      });
      return r;
    }
    
    const dlg = new BaseDialog("@file-browser");
    dlg.addCloseButton();
    const header = new Table(), con = new Table(), footer = new Table();
    dlg.cont.add(header).pad(5).growX().row();
    dlg.cont.add(con).pad(5).grow().row();
    dlg.cont.add(footer).pad(5).growX().row();
    const path = new Label(""), fil = new ImageButton(Icon.filter), selAll = new ImageButton(Icon.move), selRange = new ImageButton(Icon.flipY), selDel = new ImageButton(Icon.cancel), add = new ImageButton(Icon.add), del = new ImageButton(Icon.trash);
    
    
    let curFi;
    const openFi = function(fi){
      
    }
    const openDir = function(dir){
      
    }
    const open = function(fi){
      if(typeof fi === "string"){
        fi = new Fi(fi);
      }
      if(!fi || !(fi instanceof Fi) || !fi.exists()
      || fi.path().length < rootPath.length
      || fi.path().indexOf(rootPath) != 0){
        return;
      }
      if(fi.isDirectory()){
        openDir(fi);
      }else{
        openFi(fi);
      }
      curFi = fi;
    }
    
    const show = function(fi){
      if(!fi){
        fi = curFi ? curFi : root;
      }
      open(fi);
      dlg.show();
    }
    const hide = function(){
      dlg.hide();
    }
    
    global.svn.fb.show = show;
    global.svn.fb.hide = hide;
  });
}catch(e){
  Log.err(module.id + ": " + e);
}