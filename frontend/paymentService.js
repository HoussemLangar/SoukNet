const https = require('follow-redirects').https;

function sendConfirmationEmail(email, firstName) {
  var postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="from"\r\n\r\nsouknet <houssemlangar17@souknet.tn>\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="subject"\r\n\r\nConfirmation de commande\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="to"\r\n\r\n{"to":"${email}","placeholders":{"firstName":"${firstName}"}}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="text"\r\n\r\nBonjour {{firstName}}, votre paiement a été effectué avec succès !\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

  var options = {
    'method': 'POST',
    'hostname': '51x4wd.api.infobip.com',
    'path': '/email/3/send',
    'headers': {
      'Authorization': 'App 1d1dabfba2220ef487d3ff282dcf48a4-a7c50957-f007-4861-bcf5-9a35a8d33978',
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    'maxRedirects': 20
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  req.write(postData);
  req.end();
}

module.exports = { sendConfirmationEmail };
