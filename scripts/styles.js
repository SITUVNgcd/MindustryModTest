try{
  global.svn.styles = {};
  global.svn.evt.load(()=>{
    try{
      const flati = new ImageButton.ImageButtonStyle(Styles.flati);
      Object.assign(flati, {
        up: Styles.black3,
        down: Styles.black5,
        imageUpColor: Color.white,
        imageDisabledColor: Color.darkGray,
        imageCheckedColor: Color.white
      });
      global.svn.styles.flati = flati;
      const flatt = new TextButton.TextButtonStyle(Styles.flatt);
      Object.assign(flatt, {
        up: Styles.black3,
        down: Styles.black5,
        disabledFontColor: Color.darkGray,
        checkedFontColor: Color.white
      });
      global.svn.styles.flatt = flatt;
      const flatTogglet = new TextButton.TextButtonStyle(Styles.flatTogglet);
      global.svn.styles.flatTogglet = flatTogglet;
    }catch(e){
      Log.err(e);
    }
  });
}catch(e){
  Log.err(module.id + ": " + e);
}