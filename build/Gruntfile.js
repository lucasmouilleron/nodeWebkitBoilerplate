/////////////////////////////////////////////////////////////////////////
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux32 = /^linux/.test(process.platform);
var isLinux64 = /^linux64/.test(process.platform);
var os = "unknown";
if (isWin)
  os = "win";
if (isMac)
  os = "osx";
if (isLinux32)
  os = "linux32";
if (isLinux64)
  os = "linux64";

/////////////////////////////////////////////////////////////////////////
var exec = require("child_process").exec;
var path = require("path");
var currentPath = path.resolve(process.cwd(), ".");
var nwVer = "0.10.5";
var nwExec = "";
if (!isMac)
  nwExec = "cache/" + nwVer + "/" + os + "/nw.exe "+currentPath+"/../src";
else
  nwExec = "open -n cache/" + nwVer + "/" + os + "/node-webkit.app --args "+currentPath+"/../src";

/////////////////////////////////////////////////////////////////////////
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cfg: grunt.file.readJSON("config.json"),
    availabletasks: {
      tasks: {
        options: {
          sort: true,
          filter: "include",
          tasks: ["default","cleanup","watch","package", "build", "run"]
        }
      }
    },
    shell: {
      options: {
        stdout: true,
        stderr: true,
        stdin: true
      },
      install: {
        command: function() {
          return "sudo ulimit -n 100000 && cd ../src && bower cache clean && bower install && npm install";
        }
      },
      run: {
        command: function() {
          return nwExec;
        }
      }
    },
    nodewebkit: {
      package: {
        options: {
          version: nwVer,
          build_dir: "../releases",
          platforms: "<%=cfg.platforms%>",
          keep_nw: false,
          zip: false
        },
        src: ["../src/**/*"]
      },
    },
    compass: {
      compile: {
        options: {
          sassDir: "<%=cfg.sassDir%>",
          cssDir: "<%=cfg.cssDir%>",
          imagesDir: "<%=cfg.imgDir%>",
          fontsDir: "<%=cfg.fontsDir%>",
          httpStylesheetsPath:"<%=cfg.cssDir%>",
          cacheDir: "<%=localDir%>/.sass-cache",
          outputStyle:"compressed",
          relativeAssets:true,
          lineComments:false,
          raw: "preferred_syntax = :sass\n",
          environment: "production"
        }
      }
    },
    clean: {
      options: { force: true },
      stuff : ["../releases"],
    }
  });

  /////////////////////////////////////////////////////////////////////////
  grunt.loadNpmTasks("grunt-available-tasks");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-node-webkit-builder");

  /////////////////////////////////////////////////////////////////////////
  grunt.registerTask("default", "These help instructions",["availabletasks"]);
  grunt.registerTask("install", "Install the app",["clean", "shell:install", "nodewebkit:package"]);
  grunt.registerTask("package", "Package the app",["cleanup", "build", "nodewebkit:package"]);
  grunt.registerTask("run", "Run the app",["build", "shell:run"]);
  grunt.registerTask("cleanup", "Clean project",["clean"]);
  grunt.registerTask("build", "Build the app",["compass:compile"]);
};