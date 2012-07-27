XMLM = Ember.Application.create({
  name:"XML Manipulation"
});

XMLM.Attribute = Ember.Object.extend({
  key:null,
  value:null
});

XMLM.Element = Ember.Object.extend({
  name:null,
  attribute:[]
});

XMLM.xmlController = Ember.Object.create({
  content: XMLM.Element.create({name:"Phongphun"}),
  load: function() {
    $.getJSON('ajax/loadxml', function(data) {
      $.each(data, function(key, value) {
        console.log(key); 
      });
      XMLM.xmlController.content.set('name',JSON.stringify(data));
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

XMLM.xmlController.load();


/*
now.ready(function() {
  now.loadXML(function(result) {
    // alert(JSON.stringify(result));
    XMLM.elementController.content.set('name','PK');
  });
});
*/
