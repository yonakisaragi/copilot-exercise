// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
http.createServer(function(req, res) {
  // Get URL
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/') {
    // Get form.html
    fs.readFile('form.html', 'utf-8', function(err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Page Not Found');
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  } else if (pathname == '/comment') {
    // Get form data
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      var post = qs.parse(body);
      var comment = post['comment'];
      // Write to comment.txt
      fs.appendFile('comment.txt', comment + '\n', 'utf-8', function(err) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Failed to save comment');
          return res.end();
        }
        // Redirect to form.html
        res.writeHead(302, { 'Location': '/' });
        return res.end();
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Page Not Found');
    return res.end();
  }
}).listen(3000);

console.log('Server running at http://localhost:3000/');

// Execute with node comment.js
// Access http://localhost:3000/ with web browser
// Enter comment and click send
// Comment is saved in comment.txt
// Redirect to form.html
// Refresh the page to enter another comment
// Repeat the process
// Check comment.txt to see the saved comments
// Stop with Ctrl-C