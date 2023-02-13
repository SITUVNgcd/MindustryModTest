let names = [];
let named = "";
for(let name in this){
    names.push({name: name, val: this[name]});
    named += name + "\n";
}
Log.print(named);
