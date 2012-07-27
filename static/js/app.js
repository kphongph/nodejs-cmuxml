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

XMLM.displayView = Ember.View.extend({
  
});

XMLM.Element = Ember.Object.extend({
  name:null,
  attributes:[],
  children:[],
  parseJSON:function(data) {
    self = this;
    $.each(data, function(key, value) {
      if(key=='@') {
        $.each(value, function(attr_name, attr_value) {
           console.log(attr_name+' '+attr_value);
           var attr_obj = XMLM.Attribute.create({key:attr_name,value:attr_value});
           self.get('attributes').pushObject(attr_obj);
        });
        var tmp = XMLM.Element.create({name:'test1'});
        self.get('children').pushObject(tmp);
        self.set('name','PK');
        console.log('add child');
      } 
    });
  },
  display:function() {
    console.log('Display');
    var name = this.get('name');
    var str = '<'+name;
    $.each(this.get('attributes'), function(index, value) {
      str += ' '+value.key + '="' + value.value+'"';
      console.log(JSON.stringify(value));
    });
    str+='>';
    console.log('get children');
    $.each(this.get('children'),function(index, value) {
    //  console.log(JSON.stringify(value));
    //  str += value.get('display');
    });
    str += '</'+name+'>';
    return str;
  }.property('name','attributes','children','display').cacheable()
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

XMLM.elementController = Ember.Object.create({
  content: XMLM.Element.create({name:"Phongphun"}),
  load: function() {
    $.getJSON('ajax/loadxml', function(data) {
      XMLM.elementController.content.set('name',JSON.stringify(data));
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
