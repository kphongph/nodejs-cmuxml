requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
    require('lib/vkbeautify.0.98.01.beta');    
    var json2hb = require('json2hb');    
    var XMLmode = require('ace/mode/xml').Mode;        
    var ace = require('ace/ace');        
        
    exports.edit = function(context) {
        var container = document.getElementById(context.element);
        //var container = $('#'+el);
        var editor = ace.edit(container);        
        editor.commands.addCommands([{
            name: "prettyprint",
            bindKey: {win:"Ctrl-P"},
            exec: function(editor) {
                editor.setValue(vkbeautify.xml(editor.getValue(),2)); 
                editor.clearSelection();         
            }
        },{
            name: "converttojson",
            bindKey: {win:"Ctrl-Y"},
            exec: function(editor,env) {
                $.ajax({
                    url: 'ajax/xml2json',
                    type: 'POST',            
                    data: JSON.stringify({ xml: editor.getValue()}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",                        
                    success: function(data) {                    
                      context.convert(data);
                    }
                });
            }
        }]);
        
        editor.setFadeFoldWidgets(false);
        editor.getSession().setMode(new XMLmode());
        editor.getSession().setFoldStyle("markbegin");
        editor.setFontSize(14);
        return editor;
    };            
});
