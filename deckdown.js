var fs = require("fs")
  , ejs = require('ejs')
  , marked = require('marked')
  , diveSync = require("diveSync")
  , extend = require('node.extend');


//load the template
var template = {
  main: fs.readFileSync(process.cwd() + "/templates/default/index.html", "utf8"), 
  slides: fs.readFileSync(process.cwd() + "/templates/default/masters/default.html", "utf8")
};

console.log(template);

//load and breakup markdown file

fs.readFile(process.cwd() + "/pres/test.md", "utf8", function(error, data) {
  var rawSlides = mdToHtmlArray(data);
  //combine
  var slides = rawSlides.map(function(slide, i){
    return ejs.render(template.slides, {
      content: slide.content
    });
  });
  var deck = ejs.render(template.main, {
    content: slides.join("")
  });
  console.log(deck);   
  
  fs.writeFile(process.cwd() + '/pres/test.html', deck, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  
});  

 


//functions

function mdToHtmlArray(markdown){
    var html = marked(markdown);
    
    //Array of values we need to prepend after the split
    var headers = html.match(/<h[1-6]/g); 
    
    //leave a marker for splitting
    html = html.replace(/<h[1-6]/g, '<========slide=========>'); 
    var slides = html.split("<========slide=========>"); 
    
    //element 0 is whitespace. artifact of split method
    slides.shift(); 
    
    slides = slides.map(function(s, i){
      //add proper header number back after it was lost in the replace
      return {
        'level': headers[i].slice(1),
        'content': headers[i] + s
      }; 
    });
    
    return slides;
  }

  
  //console.log(slides);
  /*
  var output = "";
  slides.forEach(function(slide, i){
    if(slide.length > 0){
      output += '<section id="slide_' + i + '" class="slide"><h' + slide + '\r\n</section>'
    }
  });
  
  
  fs.readFile(path, "utf8", function(error, data) {
    var deck = ejs.render(data, {
        filename: path,
        contents: output
      });
    fs.writeFile('pres/test.html', deck, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });
  */
  




