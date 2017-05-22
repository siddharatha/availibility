
const Promise = require("bluebird");
const moment = require('moment');

fs = Promise.promisifyAll(require("fs"));
var mymap = {};
function getFileNames() {
  return fs.readdirAsync("./availibility/").then(res => { // lire fichier
    filenames = Object.keys(res)
      .map(objkey => { // met dans une map
        if (res[objkey].startsWith("revision")) return res[objkey];
      })
      .filter(item => item && item != null);

    Promise.mapSeries(filenames, function(fileName) { 
      var contents = fs
        .readFileAsync("./availibility/" + fileName, "utf8") // met chacun de not fichier
        .catch(function ignore() {});
      return Promise.join(contents, function(contents) { // on met on place notre map avec le nom du fichier et son contenu
        //console.log(contents);
        return {
          fileName,
          contents
        };  
      });
    }).each(function(eachfile) {
	  if(eachfile.contents){
     
		jsonobject = JSON.parse(eachfile.contents); // pour chaque fichier on lit le contenu 

		if(jsonobject && jsonobject.hasOwnProperty('messages'))	
        eachfile.contents = jsonobject.messages[0].message.results; // on restructure notre fichier json 
	  }    
	  eachfile.fileName = eachfile.fileName.substring('revision_'.length,(eachfile.fileName.length-5)); // on renome notre fichier et garde seulement le TimeStamp
    if(eachfile.contents){
      eachfile.initial = {};    
    eachfile.contents.forEach((eachid)=>{      
      if(!mymap.hasOwnProperty(eachid.id))
        mymap[eachid.id]=[];        
        var isAvailable = eachid.hasOwnProperty('isAvailable');
        var timenow = moment(eachfile.fileName).format('DD/MM/YYYY hh:mm:ss') + '';        
        mymap[eachid.id].push({"timenow":timenow,"isAvailable":isAvailable});                       
    });
    }
	})
  .then(()=>{       
    var newmap ={};
    Object.keys(mymap).forEach(id=>{
      newmap[id]=[];
      var initial = {};
      mymap[id].forEach((eachrec,index)=>{
        if(index===0)          
          initial={"timenow":eachrec.timenow,"isAvailable":eachrec.isAvailable};              
        if(eachrec.isAvailable != initial.isAvailable){
          newmap[id].push({"starttime":initial.timenow,"endtime":eachrec.timenow,"isAvailable":initial.isAvailable});               
          initial={"timenow":eachrec.timenow,"isAvailable":eachrec.isAvailable};              
        }      
      });
      if(newmap[id].length===0)      
        newmap[id].push({"starttime":mymap[id][0].timenow,"endtime":mymap[id][mymap[id].length -1 ].timenow,"isAvailable":initial.isAvailable});               
    });
   // return newmap;
    console.log(fs.writeFile('result.json',JSON.stringify(newmap,null,2),function(err){console.log(err)}));
  })  


  });
}

getFileNames()
  .then(finalresults => console.log(finalresults)
  )
  .catch(err => console.error(err));
