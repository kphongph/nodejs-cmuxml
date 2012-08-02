App = Ember.Application.create({
  name:"XML Manipulation",
  ready: function() {
    App.xmlController.load();
  }
});

App.Attribute = Ember.Object.extend({
  key:null,
  value:null,

});

App.Element = Ember.Object.extend({
  attributes:null,
  children:null,
  show:null,

  
  init: function() {
    this._super();
    this.set('attributes',[]);
    this.set('children',[]);
  },
  parseJSON:function(data) {
    var self = this;
    $.each(data, function(key, value) {
      if(key=='@') {
        $.each(value, function(attr_name, attr_value) {
           var attr_obj = App.Attribute.create({key:attr_name,value:attr_value});
           self.get('attributes').pushObject(attr_obj);
        });
      } else {
        var children = self.get('children');
        var child = App.Element.create({name:key});
        if(typeof value === 'object') {
          if(value instanceof Array) {
            $.each(value, function(idx, array_obj) {
              var tmp_child = App.Element.create({name:key});
              tmp_child.parseJSON(array_obj);
              tmp_child.set('show',true);
              children.pushObject(tmp_child);
            });
          } else {
            child.parseJSON(value);
            child.set('show',true);
            children.pushObject(child);
          }
        } else {
          if(typeof value === 'string') {
            child.set('text',value);
            child.set('show',true);
            children.pushObject(child);
          }
        }
      }
    });
  }
});

App.xmlController = Ember.Object.create({
  content: null,
  xml: null,

  xml_text:function() {
    return JSON.stringify(this.get('xml'));
  }.property('xml'),
  load: function() {
    self = this;
    var root = App.Element.create({name:'xml'});
    self.set('content', root);
    root.set('show',true);
    
    $.getJSON('ajax/loadxml', function(data) {
      self.set('xml', data);
      self.get('content').parseJSON(data);
    });

  },

    
});

App.ElementView = Ember.View.extend({
  tagName: 'ul',
  templateName: 'XMLViewer',

  click: function() {
    var element = this.get('content');
    console.log(element.get('name'));
    var show = element.get('show');
    if(show) {
        element.set('show',false);
    } else {
        element.set('show',true);

    }
    return false;
  },
  
  
});





