/////////////////////////////////////////////////////////////////////////
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux32 = /^linux/.test(process.platform);
var isLinux64 = /^linux64/.test(process.platform);
var os = "unknown";
if (isWin) os = "win"; if (isMac) os = "osx32";if (isLinux32) os = "linux32"; if (isLinux64) os = "linux64";

/////////////////////////////////////////////////////////////////////////
var exec = require("child_process").exec;
var path = require("path");
var currentPath = path.resolve(process.cwd(), ".");
var nodeWebkitVersion = "0.10.5";
var nodeWebkitExecCommand = "cache/" + nodeWebkitVersion + "/" + os + "/nw.exe "+currentPath+"/../src";
var installExecCommand = "cd ../src && bower cache clean && bower install && npm install";
if (isMac) {
  nodeWebkitExecCommand = "open -n cache/" + nodeWebkitVersion + "/" + os + "/node-webkit.app --args "+currentPath+"/../src";
  installExecCommand = "sudo launchctl limit maxfiles 100000 100000 && ulimit -n 99999 && "+ installExecCommand;
}

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
          tasks: ["default","cleanup","package", "build", "run", "install"]
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
          return installExecCommand;
        }
      },
      run: {
        command: function() {
          return nodeWebkitExecCommand;
        }
      }
    },
    nodewebkit: {
      package: {
        options: {
          version: nodeWebkitVersion,
          build_dir: "../releases",
          platforms: "<%=cfg.platforms%>",
          mac_icns: "../src/assets/img/icon.icns",
          keep_nw: false,
          zip: false
        },
        src: ["../src/**/*"]
      },
    },
    copyFiles: {
      main: {
        files: "<%=cfg.copyFiles%>"
      }
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
          force:true,
          raw: "preferred_syntax = :sass\n",
          environment: "production"
        }
      }
    },
    clean: {
      options: { force: true },
      stuff : ["../releases", "cache", ".sass-cache", "node_modules"],
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
  grunt.registerTask("install", "Install the app",["shell:install", "nodewebkit:package", "copyFiles:main"]);
  grunt.registerTask("package", "Package the app",["install", "build", "nodewebkit:package"]);
  grunt.registerTask("run", "Run the app",["build", "shell:run"]);
  grunt.registerTask("cleanup", "Clean project",["clean"]);
  grunt.registerTask("build", "Build the app",["compass:compile"]);

  /////////////////////////////////////////////////////////////////////////
  grunt.task.registerMultiTask("copyFiles", function() {
    var path = require("path");
    for(file in this.data.files) {
      var filesCopy = grunt.file.expand(file);
      for(fileCopy in filesCopy) {
        var from = filesCopy[fileCopy];
        var to = path.join(this.data.files[file], path.basename(from));
        grunt.log.ok("Copying "+from+" to "+to)
        grunt.file.copy(from, to);
      }
    }
  });
};