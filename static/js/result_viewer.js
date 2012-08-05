requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
    require('lib/vkbeautify.0.98.01.beta');    
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
        }]);
        
        editor.setFadeFoldWidgets(false);
        editor.getSession().setMode(new XMLmode());
        editor.getSession().setFoldStyle("markbegin");
        editor.setFontSize(14);
        editor.setReadOnly(true);
        return editor;
    };            
});
