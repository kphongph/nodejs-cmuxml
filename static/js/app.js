XMLM = Ember.Application.create({
  name:"XML Manipulation",
  ready: function() {
    XMLM.xmlController.load();
  }
});

XMLM.Attribute = Ember.Object.extend({
  key:null,
  value:null
});

XMLM.childrenController = Ember.ArrayController.create({
  content:[],
});


XMLM.Element = Ember.Object.extend({
  attributes:null,
  children:null,
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
           console.log(attr_name+' '+attr_value);
           var attr_obj = XMLM.Attribute.create({key:attr_name,value:attr_value});
           self.get('attributes').pushObject(attr_obj);
        });
      } else {
        var children = self.get('children');
        var child = XMLM.Element.create({name:key});
        console.log('+Add child <' + key +'> to '+self.get('name'));
        console.log('Add child value ' + JSON.stringify(value));
        console.log(typeof value);
        if(typeof value === 'object') {
          console.log('+parseJSON for '+key+' '+self.get('name'));
          child.parseJSON(value);
          children.pushObject(child);
          console.log('-Add child <' + key +'> to '+self.get('name'));
          console.log('-parseJSON for '+key+' '+self.get('name'));
        } else {
          if(typeof value === 'string') {
            child.set('text',value);
            console.log('Set text value ' + JSON.stringify(value));
            children.pushObject(child);
            console.log('-Add child <' + key +'> to '+self.get('name'));
          }
        }
      }
    });
    console.log('return from parseJSON');
    return;
  },
  display:function() {
    var name = this.get('name');
    var str = '<'+name;
    $.each(this.get('attributes'), function(index, value) {
      str += ' '+value.key + '="' + value.value+'"';
    });
    str+='>';
    $.each(this.get('children'),function(index, value) {
      str += value.get('display');
    });
    var text = this.get('text');
    if(typeof text === 'string') {
      str += text;
    }
    str += '</'+name+'>';
    return str;
  }.property('name','attributes.@each','children.@each','display','text')
});

XMLM.xmlController = Ember.Object.create({
  content: null,
  xml: null,
  xml_text:function() {
    return JSON.stringify(this.get('xml'));
  }.property('xml'),
  load: function() {
    self = this;
    self.set('content',XMLM.Element.create({name:'xml'}));
    $.getJSON('ajax/loadxml', function(data) {
      self.set('xml', data);
      self.get('content').parseJSON(data);
    });
  }
});

/*
now.ready(function() {
  now.loadXML(function(result) {
    // alert(JSON.stringify(result));
    XMLM.elementController.content.set('name','PK');
  });
});
*/
