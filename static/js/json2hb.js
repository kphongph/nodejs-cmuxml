define(function(require, exports, modules) {
  exports.convert = function(data,parent) {
    var self = this;
    var str = '';
    $.each(data, function(key, content) {
      var c_parent = null;
      if(parent) {
        c_parent = parent+'.'+key;
      } else {
        c_parent = key;
      }
      if(key != "$" && key != "_") {
        if($.isPlainObject(content)) {
          str+='<'+key;
          $.each(content, function(key, value) {
            if(key == "$") {
              $.each(value, function(att_key, att_value) {
                str+=' '+att_key+'="{{'+c_parent+'.$.'+att_key+'}}"';
              });
            } 
          });
          str+='>';
          $.each(content, function(key, value) {
            if(key == "_") {
              str+='{{'+c_parent+'._}}';
            }
          });
          var data = self.convert(content,c_parent);
          str+=data;
          str+='</'+key+'>';
        } else {
          if($.isArray(content)) {
            $.each(content, function(index, value) {
              var tmp_obj = {};
              tmp_obj[key] = value;
              str+=self.convert(tmp_obj,parent);
            });
          } else {
            str+='<'+key+'>{{'+parent+'.'+key+'}}</'+key+'>';
          }
        }
      }
      console.log('for key('+key+') -> '+str);
    });
    return str;
  };
});
