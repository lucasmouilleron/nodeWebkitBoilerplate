module.exports = function(grunt) {

  var mkdirp = require("mkdirp");
  mkdirp("../dist");

  /////////////////////////////////////////////////////////////////////////
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cfg: grunt.file.readJSON("config.json"),
    webDir:"../",
    availabletasks: {
      tasks: {
        options: {
          sort: true,
          filter: "include",
          tasks: ["default","intro","cleanup","speed","compile:images","watch","build", "compile:styles", "watch:styles"]
        }
      }
    },
    nodewebkit: {
      options: {
        platforms: ["osx"],
        buildDir: "../dist",
      },
      src: ["../app/**/*","../assets/**/*","../node_modules","../data/**/*","../package.json","../index.html"]
    },
    compass: {
      compile: {
        options: {
          httpPath: "<%=cfg.baseURL%>",
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
    watch: {
      sass: {
        files: ["<%=cfg.sassDir%>/**/*.scss"],
        tasks: ["compile:styles"]
      }
    },
    clean: {
      options: { 
        force: true 
      },
      default: {
        src: "<%=cfg.cleanFiles%>"
      }
    },   
    autoprefixer: {
      options: {
        browsers: ["last 2 version"]
      },
      default: {
        files: [{
          expand: true, 
          cwd: "<%=cfg.cssDir%>/",
        src: "{,*/}*.css",
        dest: "<%=cfg.cssDir%>/"
      }]
    }
  }
});

  /////////////////////////////////////////////////////////////////////////
  grunt.loadNpmTasks("grunt-available-tasks");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-autoprefixer");
  grunt.loadNpmTasks("grunt-node-webkit-builder");

  /////////////////////////////////////////////////////////////////////////
  grunt.registerTask("default", "These help instructions",["availabletasks"]);
  grunt.registerTask("cleanup", "Clean project",["clean:default"]);
  grunt.registerTask("watch:styles", "Compile sass files",["watch:sass"]);
  grunt.registerTask("compile:styles", "Watch and compile sass files",["compass:compile","autoprefixer"]);
  grunt.registerTask("build", "Build all",["compile:styles", "compress:build","copy:prebuild","copy:build", "cleanup"]);
};