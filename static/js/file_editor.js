requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
    require('lib/vkbeautify.0.98.01.beta');    
    var XMLmode = require('ace/mode/xml').Mode;        
    var ace = require('ace/ace');        
    var Editor = require('ace/editor').Editor;
    var EditSession = require("ace/edit_session").EditSession;
    var Dom = require("ace/lib/dom");
    var UndoManager = require("ace/undomanager").UndoManager;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var MultiSelect = require("ace/multi_select").MultiSelect;

    var Event = require("ace/lib/event");
    

    
    exports.edit = function(context) {
        if (typeof(context.element) == "string") {
            context.element = document.getElementById(context.element);
        }

        var doc = new EditSession(Dom.getInnerText(context.element));
        doc.setUndoManager(new UndoManager());
        context.element.innerHTML = '';

        Editor.prototype.switchReadMode = function() {
            var readonly = this.getReadOnly();
            if(readonly) {
                this.setReadOnly(false);
                this.setTheme(require('ace/theme/tomorrow_night_eighties'));
            } else {
                this.setReadOnly(true);                
                this.setTheme(require('ace/theme/textmate'));
            }
        };        

        Editor.prototype.openFile = function(file) {
            var self = this;
            $.ajax({
                url: 'ajax/readfile',
                type: 'POST',            
                data: JSON.stringify({ file: file}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",                        
                success: function(data) {
                    self.setValue(data.content);
                    self.clearSelection();       
                }
            });    
        }

        Editor.prototype.saveFile = function(context) {
            var self = this;
            $.ajax({
                //url: 'ajax/savefile',
                url: '/mongo/create',
                type: 'POST',            
                data: JSON.stringify({ file: context.file, content:self.getValue()}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",                        
                success: function(data) {
                    if (data.status == 'ok') {
                        context.success(data);
                    }
                }
            });    
        }

        Editor.prototype.switchReadMode = function() {            
            var readonly = this.getReadOnly();
            if(readonly) {
                this.setReadOnly(false);
                this.setTheme(require('ace/theme/tomorrow_night_eighties'));
            } else {
                this.setReadOnly(true);
                
                this.saveFile({
                    file:'foo.xml',
                    success: function(data) {
                        console.log(data);
                    }
                });
                
                this.setTheme(require('ace/theme/textmate'));
            }
        };
        
        
        var editor = new Editor(new Renderer(context.element, require("ace/theme/textmate")));        
        new MultiSelect(editor);
        editor.setSession(doc);

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
        

        var env = {};
        env.document = doc;
        env.editor = editor;
        editor.resize();
        Event.addListener(window, "resize", function() {
            editor.resize();
        });
        context.element.env = env;
        // Store env on editor such that it can be accessed later on from
        // the returned object.
        editor.env = env;
        return editor;
    };            
});
