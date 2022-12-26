function include(filename, afterfunc) {

  include.seq = (include.seq)? include.seq + 1: 1;

  var id = new Date().getTime() + "-" + include.seq;
  var inc = document.createElement("iframe");

  inc.id = "inc-" + id;
  inc.src = filename;
  inc.style.display = "none";
  document.write("<span id=\"" + id + "\"></span>");
    
  var incfunc = function() {
    
    var s = inc.contentWindow.document.body.innerHTML;
    var suffix = (n = filename.lastIndexOf(".")) >= 0 ? filename.substring(n): "default";
    if (suffix == ".txt") s = inc.contentWindow.document.body.firstChild.innerHTML;

    var span = document.getElementById(id);

	var htmlStr = s.split("&gt;").join(">").split("&lt;").join("<");
    
    if (document.createRange) {
      var range = document.createRange();
      range.setStartBefore(span);
      span.parentNode.insertBefore(range.createContextualFragment(htmlStr), span);
    } else {
      span.insertAdjacentHTML('BeforeBegin', htmlStr);
    }
    
    document.body.removeChild(inc);
    span.parentNode.removeChild(span);
    if (afterfunc) afterfunc();
  };

  if (window.attachEvent) {
    window.attachEvent('onload', 
      function() {
        document.body.appendChild(inc); 
        inc.onreadystatechange = function() { if (this.readyState == "complete") incfunc(); };
      });
  }
  else {
    document.body.appendChild(inc);
    inc.onload = incfunc;
  }
}