requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
    require('lib/vkbeautify.0.98.01.beta');    
    var XMLmode = require('ace/mode/xml').Mode;        
    var ace = require('ace/ace');        
        
    exports.edit = function(el) {
        console.log('run edit for xml editor');
        var container = document.getElementById(el);
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
            bindKey: {win:"Ctrl-C"},
            exec: function(editor) {
                $.ajax({
                    url: 'ajax/xml2json',
                    type: 'POST',            
                    data: JSON.stringify({ xml: editor.getValue()}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",                        
                    success: function(data) {                    
                        /*
                        var str = vkbeautify.json(JSON.stringify(data),2); 
                        json_viewer.setValue(str);
                        json_viewer.clearSelection();
                        */
                    }
                });
            }
        }]);
                
        
        $('#'+el).width($(window).width()*0.80);
        $('#'+el).height($(window).height()*0.60);                
        editor.resize();
        
        $(window).bind('resize', function(event, ui) {            
            $('#'+el).width($(window).width()*0.80);
            $('#'+el).height($(window).height()*0.60);
            editor.resize();
        });                        

        editor.setFadeFoldWidgets(false);
        editor.getSession().setMode(new XMLmode());
        editor.getSession().setFoldStyle("markbegin");
        
        return editor;
    };            
});
