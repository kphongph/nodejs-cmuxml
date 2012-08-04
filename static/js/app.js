requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
  require('lib/emberjs/lib/ember');
  require('lib/vkbeautify.0.98.01.beta');
    
  var XMLmode = require('ace/mode/xml').Mode;
  var JSONmode = require('ace/mode/json').Mode;
  
  var ace = require('ace/ace');
  var dom = require("ace/lib/dom");
  var theme = require("ace/theme/textmate");
  var Split = require('ace/split').Split;
  var xml_editor = null;
  var json_viewer = null;
  var handlebars_editor = null;
  var xml_viewer = null;  
    
  
  
  $(document).ready(function() {
    
     var editor = require('xml_editor').edit('test_editor');
     /* 
     var first_split = new Split(document.getElementById("xml_editor"),theme,2);
     first_split.setOrientation(first_split.BELOW);
     first_split.setFontSize(14);
     xml_editor = first_split.getEditor(0);          
     
     xml_editor.commands.addCommands([{
       name: "prettyprint",
       bindKey: {win:"Ctrl-P"},
       exec: function(editor) {
         editor.setValue(vkbeautify.xml(editor.getValue(),2)); 
         editor.clearSelection();         
       }
     },{
       name: "converttojson",
       bindKey: {win:"Ctrl-C"},
       exec: function(editor) {
         $.ajax({
           url: 'ajax/xml2json',
           type: 'POST',            
           data: JSON.stringify({ xml: editor.getValue()}),
           contentType: "application/json; charset=utf-8",
           dataType: "json",                        
           success: function(data) {                    
             var str = vkbeautify.json(JSON.stringify(data),2); 
             json_viewer.setValue(str);
             json_viewer.clearSelection();
           }
         });
       }
     }]);

     xml_editor.setFadeFoldWidgets(false);
     xml_editor.getSession().setMode(new XMLmode());
     xml_editor.getSession().setFoldStyle("markbegin");

     json_viewer = first_split.getEditor(1)
     json_viewer.getSession().setMode(new JSONmode());
     json_viewer.setReadOnly(true);
     json_viewer.renderer.setShowGutter(false);
     json_viewer.renderer.hideCursor();
     json_viewer.setHighlightActiveLine(false);
     json_viewer.setShowPrintMargin(false);
     json_viewer.setTheme('ace/theme/idle_fingers');
     
     $('#xml_editor').resizable();
     $('#xml_editor').bind('resize', function(event, ui) {
       first_split.resize();
     });
     
     var split = new Split(document.getElementById("handlebars_editor"),theme,2);
     split.setOrientation(split.BELOW);
     split.setFontSize(14);
     split.resize();

     
     handlebars_editor = split.getEditor(0)
     handlebars_editor.setFadeFoldWidgets(false);
     handlebars_editor.getSession().setMode(new XMLmode());
     handlebars_editor.getSession().setFoldStyle("markbegin");
     
     handlebars_editor.commands.addCommands([{
       name: "prettyprint",
       bindKey: {win:"Ctrl-P"},
       exec: function(editor) {
         editor.setValue(vkbeautify.xml(editor.getValue(),2)); 
         editor.clearSelection();         
       }
     },{
       name: "transform",
       bindKey: {win:"Ctrl-C"},
       exec: function(editor) {
         var template = Handlebars.compile(editor.getValue());
         xml_viewer.setValue(template(JSON.parse(json_viewer.getValue())));
         xml_viewer.clearSelection();
       }
     }]);
          

     xml_viewer = split.getEditor(1)
     xml_viewer.getSession().setMode(new XMLmode());
     xml_viewer.setReadOnly(true);
     xml_viewer.renderer.setShowGutter(false);
     xml_viewer.renderer.hideCursor();
     xml_viewer.setHighlightActiveLine(false);
     xml_viewer.setShowPrintMargin(false);
     xml_viewer.setTheme('ace/theme/idle_fingers');
     
     
     // set for test
     xml_editor.setValue('<xml a="1"><b>1234</b></xml>');     
     xml_editor.clearSelection();
     json_viewer.setValue('{}');
     json_viewer.clearSelection();
     handlebars_editor.setValue('<nook></nook>');
     handlebars_editor.clearSelection();
     */          
  });
  
  $("#convert").on('click', function() {
    $.ajax({
      url: 'ajax/xml2json',
      type: 'POST',            
      data: JSON.stringify({ xml: xml_editor.getValue()}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",                        
      success: function(data) {                    
        var str = vkbeautify.json(JSON.stringify(data),2); 
        json_viewer.setValue(str);
        json_viewer.clearSelection();
      }
    });
  });


  $("#transform").on('click', function() {
    var template = Handlebars.compile(handlebars_editor.getValue());
    xml_viewer.setValue(template(JSON.parse(json_viewer.getValue())));
    xml_viewer.clearSelection();
  });

});
