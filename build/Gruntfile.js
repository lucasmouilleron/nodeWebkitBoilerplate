module.exports = function(grunt) {

  var mkdirp = require("mkdirp");
  mkdirp("../dist");

  /////////////////////////////////////////////////////////////////////////
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cfg: grunt.file.readJSON("config.json"),
    distDir: "../dist",
    macBin: "node-webkit.app",
    availabletasks: {
      tasks: {
        options: {
          sort: true,
          filter: "include",
          tasks: ["default","intro","cleanup","speed","compile:images","watch","package", "compile:styles", "watch:styles", "run"]
        }
      }
    },
    copy: {
      options: {
        mode: true
      },
      main: {
        files: [
        {src: "../app/**", dest: "<%=distDir%>/app/"},
        {src: "../assets/**", dest: "<%=distDir%>/assets/"},
        {src: "../node_modules/**", dest: "<%=distDir%>/node_modules/"},
        {src: "../index.html", dest: "<%=distDir%>/index.html"},
        {src: "../package.json", dest: "<%=distDir%>/package.json"},
        ]
      },
      mac: {
        files: [
        {src: "../<%=macBin%>/**", dest: "<%=distDir%>/<%=macBin%>/"},
        ]
      }
    },
    exec: {
      runmac: {
        command: 'open -n ../<%=macBin%> "../"'
      }
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
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-exec");

  /////////////////////////////////////////////////////////////////////////
  grunt.registerTask("default", "These help instructions",["availabletasks"]);
  grunt.registerTask("cleanup", "Clean project",["clean:default"]);
  grunt.registerTask("watch:styles", "Compile sass files",["watch:sass"]);
  grunt.registerTask("compile:styles", "Watch and compile sass files",["compass:compile","autoprefixer"]);
  grunt.registerTask("run:mac", "Run the app on Mac Os",["exec:runmac"]);
  grunt.registerTask("package:mac", "Package the app",["compile:styles","copy:main","copy:mac"]);
};