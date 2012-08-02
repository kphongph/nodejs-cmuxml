requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
  require('lib/jquery-1.7.2.min');
  require('lib/emberjs/lib/ember');
  var XMLmode = require('ace/mode/xml').Mode;
  var JSONmode = require('ace/mode/json').Mode;
  
  var ace = require('ace/ace');
  var theme = require("ace/theme/textmate");
  var Split = require('ace/split').Split;
  var xml_editor = null;
  var json_viewer = null;
  var handlebars_editor = null;
  var xml_viewer = null;
  
  $(document).ready(function() {
     var split = new Split(document.getElementById("editor"),theme,4);
     split.setOrientation(split.BELOW);
     xml_editor = split.getEditor(0);
     xml_editor.getSession().setMode(new XMLmode());

     json_viewer = split.getEditor(1)
     json_viewer.getSession().setMode(new JSONmode());
     json_viewer.setReadOnly(true);
     
     handlebars_editor = split.getEditor(2)
     handlebars_editor.getSession().setMode(new XMLmode());

     xml_viewer = split.getEditor(3)
     xml_viewer.getSession().setMode(new XMLmode());
     xml_viewer.setReadOnly(true);
     
     // set for test
     xml_editor.setValue('<xml a="1"><b>1234</b></xml>');
     handlebars_editor.setValue('<nook></nook>');
  });
  
  $("#convert").on('click', function() {
    $.ajax({
      url: 'ajax/xml2json',
      type: 'POST',            
      data: JSON.stringify({ xml: xml_editor.getValue()}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",                        
      success: function(data) {                    
        json_viewer.setValue(JSON.stringify(data));
      }
    });
  });


  $("#transform").on('click', function() {
    var template = Handlebars.compile(handlebars_editor.getValue());
    xml_viewer.setValue(template(JSON.parse(json_viewer.getValue())));
  });

});
