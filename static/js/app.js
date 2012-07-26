XMLM = Ember.Application.create({
  name:"XML Manipulation"
});

XMLM.Element = Ember.Object.extend({
  name:null
});

XMLM.elementController = Ember.Object.create({
  content: XMLM.Element.create({name:"Phongphun"}),
  say: function() {
    alert("Hello");
  }
});

now.ready(function() {
  now.loadXML(function(result) {
    alert(JSON.stringify(result));
  });
});
