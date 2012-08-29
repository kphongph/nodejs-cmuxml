requirejs.config({
  paths: {
    ace:'lib/ace/lib/ace/'
  }
});

define(function(require, exports, modules) {
  require('lib/vkbeautify.0.98.01.beta');
  require('ember-0.9.8.1.min');
  var dom = require('ace/lib/dom');
  var template = null;
  var json_data = {};


  $(document).ready(function() {
        
      var result_viewer = require('file_editor').edit({
     element: 'result_viewer'      
    });

    result_viewer.openFile('foo.xml');
    $("#editmode").button();
    
    $("#editmode").bind('click', function() {
        var mode = $(this).attr('value');
        if (mode == "Edit") {
            $(this).attr('value','Save');            
        } else {
            $(this).attr('value','Edit');
        }
        result_viewer.switchReadMode();        
    });
    
  });

  function test() {
      var xml_editor = require('xml_editor').edit({
      element:'xml_editor',
      convert: function(data) {
        json_data = data;
        console.log(JSON.stringify(data));
      }
    });
    var sample_str = '<xml a="1"><b><e a1="100">1</e><e>2</e></b><c e="abc">123</c></xml>';     
    xml_editor.setValue(sample_str);     
    xml_editor.clearSelection();
    

     
    var handlebar_editor = require('handlebars_editor').edit({
      element: 'handlebars_editor',
      transform: function(data) {
        template = Handlebars.compile(data);
        var result = template(json_data);
        result = result.replace(/\>(\s)*/g,'>');
        result = result.replace(/(\s)*\</g,'<');
        result_viewer.setValue(vkbeautify.xml(result,2));
        result_viewer.clearSelection();
	result_edit.setValue(vkbeautify.xml(result,2));     
	result_edit.clearSelection();
      }
    });
    var s_temp = '{{! Access attribute }}\n';
    s_temp += '<att>{{xml.$.a}}</att>\n\n';
    s_temp += '{{! Access array of element }} \n';
    s_temp += '{{#each xml.b.e}}\n';
    s_temp += '  <a text="{{_}}">\n';
    s_temp += '    {{$.a1}}\n';
    s_temp += '  </a>\n';
    s_temp += '{{/each}}\n\n';
    s_temp += '<e>\n';
    s_temp += '  <{{xml.c.$.e}} c="true">{{xml.c._}}</{{xml.c.$.e}}>\n';
    s_temp += '</e>\n';
    handlebar_editor.setValue(s_temp);
    handlebar_editor.clearSelection();
  }
  
});


