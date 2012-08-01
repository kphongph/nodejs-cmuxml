
App = Ember.Application.create();

App.xmlController = Ember.Object.create({
    content: null,
    xml_string: null,
    json_string: null,    
    handlebars_string: null,
    init: function() {
        this._super();
        this.set('xml_string','<xml a="1"><b>123</b></xml>');
        this.set('handlebars_string','<nook></nook>');        
    },    
    submitXML: function() {
        var self = this;
        var xml_data = this.get('xml_string');
        if(xml_data) {
            $.ajax({
                url: 'ajax/xml2json',
                type: 'POST',            
                data: JSON.stringify({ xml: this.get('xml_string')}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",                        
                success: function(data) {                    
                    self.set('json_string', JSON.stringify(data));
                    self.transform();
                }
            });
        }
    },
    transform: function() {
        var template = Handlebars.compile(this.get('handlebars_string'));
        //console.log(JSON.parse(this.get('json_string')));
        this.set('content',template(JSON.parse(this.get('json_string'))));                
    }
});       

App.JSONDisplayView = Ember.View.extend({
    contentBinding: 'App.xmlController.json_string',
    controllerBinding:'App.xmlController',
});

App.XMLDisplayView = Ember.View.extend({
    contentBinding: 'App.xmlController.content',
    controllerBinding:'App.xmlController',    
});

App.XMLEditorView = Ember.TextArea.extend({
    rows:"10",
    valueBinding:"App.xmlController.xml_string",
    controllerBinding:'App.xmlController',
    classNames:"input",
    keyDown:function(event){
        this.get('controller').submitXML();
    }
});

App.JSONEditorView = Ember.TextArea.extend({
    rows:"10",
    valueBinding:"App.xmlController.handlebars_string",
    controllerBinding:'App.xmlController',
    classNames:"input",
    keyDown:function(event){
        this.get('controller').transform();
    },

});









