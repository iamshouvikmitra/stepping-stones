# MEND - An Web based application for Road Defect Discovery via crowdsourcing 

## Welcome to MEND Readme.

In order to get up and running with the project you need to serve the static HTML files
via an Simple HTTP server.

*************************************************************************************************
|  Notice - The application will not work properly if accessed via file:// urls. You might      |
|  want to serve them via a HTTP server when running locally or via HTTPS when in production.   |
*************************************************************************************************

## Deploying using Python Simple HTTP Server.
- Open up a terminal in the current directory containing the file index.html
- Paste the command 
    python -m SimpleHTTPServer 5500
    or
    python3 -m SimpleHTTPServer 5500
- Navigate to http://localhost:5500/index.html in your web browser.

Please make proper adjustment to the file scripts/index.js if you wish to serve it on a 
different port.ks

## Contributors 
    - Shouvik Mitra
    - Vipul H. Harihar 
    - Neeraj Chhimwal