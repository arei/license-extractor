/*
	Recursively walk your project and find all license files.

	Copyright 2014, Glen R. Goodwin

 */

"use strict";

var FindIt = require("findit");
var FS = require("fs");
var Rimraf = require("rimraf");
var Mkdirp = require("mkdirp");
var Path = require("path");

var args = require("minimist")(process.argv.slice(2),{
	string: ["source","target","mode", "dependencies"],
	boolean: ["overwrite","noheaders"],
	default: {
		source: ".",
		target: "./LICENSES",
		mode: "output",
		overwrite: false,
		noheaders: false
	}
});

var LICENSE_FILE_MATCHERS = [
	/LICENSE(-[\w.-_])?(\.TXT|\.MD|\.)?$/i
];

var source = args.source;
var mode = args.mode.toLowerCase();
var target = Path.resolve(args.target);
var dependencies = ("dependencies" in args);
var licenses = [];

if (mode!=="merge" && mode!=="collect" && mode!=="output") mode = "output";

var consume = function() {
	licenses.forEach(function(file){
		var title = file;

		title = title.replace(/[\\\/]?node_modules[\\\/]?/g,"/");
		title = title.replace(/[\\\/]/g," ");
		title = title.replace(/\.TXT$|\.MD$|\.$/i,"");

		if (mode==="output") consumeOutput(title,file);
		if (mode==="collect") consumeCollect(title,file);
		if (mode==="merge") consumeMerge(title,file);
	});
};

var prepareOutput = function() {
	// nothing to do... here for future sake.
};

var consumeOutput = function(title,file) {
	var text = FS.readFileSync(file,{
		encoding: "utf8"
	});
	if (!text) return;

	console.log("\n\n");
	if (!args.noheaders) console.log("--------------------------------------------------------------------------------");
	if (!args.noheaders) console.log(title+" ("+file+")");
	if (!args.noheaders) console.log("--------------------------------------------------------------------------------");
	console.log(text);
	if (!args.noheaders) console.log("--------------------------------------------------------------------------------");
	if (!args.noheaders) console.log("\n");
};

var prepareMerge = function() {
	if (FS.existsSync(target)) {
		if (!args.overwrite) {
			console.error("File/Directory already exists.");
			process.reallyExit(1);
		}
		else {
			Rimraf.sync(target);
		}
	}

	FS.appendFileSync(target,"",{
		encoding: "utf8"
	});
};

var consumeMerge = function(title,file) {
	var text = FS.readFileSync(file,{
		encoding: "utf8"
	});
	if (!text) return;

	var s = "";

	s+= "\r\n\r\n";
	if (!args.noheaders) s+= "--------------------------------------------------------------------------------\r\n";
	if (!args.noheaders) s+= title+" ("+file+")\r\n";
	if (!args.noheaders) s+= "--------------------------------------------------------------------------------\r\n";
	s+= text+"\r\n";
	if (!args.noheaders) s+= "--------------------------------------------------------------------------------\r\n";
	if (!args.noheaders) s+= "\r\n";

	FS.appendFileSync(target,s,{
		encoding: "utf8"
	});

	console.log("Added "+title+" ("+file+")");
};

var prepareCollect = function() {
	if (FS.existsSync(target)) {
		if (!args.overwrite) {
			console.error("File/Directory already exists.");
			process.reallyExit(1);
		}
		else {
			Rimraf.sync(target);
		}
	}

	Mkdirp.sync(target);
};

var consumeCollect = function(title,file) {
	var text = FS.readFileSync(file,{
		encoding: "utf8"
	});
	if (!text) return;

	var targetfile = title+".txt";
	title = title.replace(/\s+/,".");
	targetfile = Path.resolve(target,targetfile);

	FS.writeFileSync(targetfile,text,{
		encoding: "utf8"
	});

	console.log("Copied "+title+" to "+targetfile);
};

var prepare = function() {
	if (mode==="output") prepareOutput();
	if (mode==="collect") prepareCollect();
	if (mode==="merge") prepareMerge();

};

var find = function() {
	var findit = FindIt(source);


	findit.on("file",function(file){
		var resfile = Path.resolve(source,file);

		if (resfile===target) return;

		var match = LICENSE_FILE_MATCHERS.some(function(re){
			return !!file.match(re);
		});

		if (!match) return;

		licenses.push(file);
	});

	findit.on("directory",function(dir,stat,stop){
		var resdir = Path.resolve(source,dir);
		if (resdir===target) stop();
	});

	findit.on("end",function(){
		console.log(licenses);
		var packageDeps = require(Path.resolve(source, './package.json')).dependencies;

		if (dependencies) {
			var temp = [];
			Object.keys(packageDeps).forEach(x => {
				licenses.forEach(y => {
					if (x.includes(y)) temp.push(y);
				})
			});

			licenses = temp;
			console.log(temp);
		}
		consume();
	});
};

prepare();
find();

