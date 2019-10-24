/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const http = require("http");
const request = require("request");
const fs = require("fs");

var dataAllCities;
var mapIDCity = {};
var listCityInfo=[];
var mapForecast = {};
var selectedCities;
var flag = false;
var c = 0;
var nCities;
//ir buscar todas as cidades á api do ipma
request("http://api.ipma.pt/open-data/distrits-islands.json", { json: false }, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  dataAllCities = body;
});

//ir buscar dados para cada cidade á api do ipma
function getInfoCity(cityID){
    request("http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/" + cityID + ".json", { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(cityID);
      listCityInfo=[];
      c++;
      listCityInfo.push(body.data[0].tMax);
      listCityInfo.push(body.data[0].tMin);
      listCityInfo.push(mapIDCity[body.globalIdLocal]);
      mapForecast[body.globalIdLocal] = listCityInfo;
      console.log(mapForecast);
    });
}

http
  .createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req.url)
    if (req.method === "POST") {
      console.log("POST");
      if (req.url === "/postCities") {
        var body = "";

        req.on("data", function(data) {
          body += data;
          console.log("data");
        });

        req.on("end", function() {
          console.log("end");
          console.log(body);
          selectedCities = body;
        });
      }
      if (req.url === "/city") {
        console.log('cityyyyy');
        var body = "";

        req.on("data", function(data) {
          body += data;
          console.log("data");
        });

        req.on("end", function() {
          console.log("end");
          console.log(body);
          city = body;
          Id = JSON.parse(body).cityId;
          getInfoCity(Id);
        });
      }
    } else {
      console.log("GET");
      if (req.url === "/teste") {
        mapForecast={};
        mapIDCity={};
        c=0;
        selectedCities="";
        info = JSON.parse(dataAllCities);
        for (i = 0; i < info.data.length; i++) {
          mapIDCity[info.data[i].globalIdLocal] = info.data[i].local;
        }
        res.writeHead(200, { "Content-Type": "text/json" });
        res.write(JSON.stringify(mapIDCity));
        res.end();
      }
      else if(req.url === "/getDetails"){
          console.log('enviarInfo');
          res.writeHead(200, { "Content-Type": "text/json" });
          res.write(JSON.stringify({state:(c==nCities)}));
          res.end();
      }
      else if(req.url === "/tableDetails"){
          console.log('yeeeeiiiiii');
          res.writeHead(200, { "Content-Type": "text/json" });
          res.write(JSON.stringify(mapForecast));
          res.end();
      }
      else if(req.url === "/details"){
          console.log('tabelaaaaa');
          res.writeHead(200, { "Content-Type": "text/json" });
          res.write(selectedCities);
          selectedCities = JSON.parse(selectedCities)
          nCities=selectedCities.number;
          console.log(nCities);
          res.end();
      }
    }
  })

  .listen(8080);