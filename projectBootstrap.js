/******************************************************************************************

			projectBootstrap.js | 2012

			Author: Federico Weber
			Author URL: http://federicoweber.com
			
			Copyright (c) 2012 Federico Weber
			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
			INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
			PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
			HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
			OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
			SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

			<----------------------------------------------------------------------------->
			
											!!!NOTES!!!
			
			The purpose of this script is to automate the creation of new web app projects.
			It require node.js to run v0.5 or newer.
			
			It will look for a init.json file inside the target folder, to setup the project.
			If no init.json is provided it will use the default one.

			Usage:
			$ target=PROJECT_FOLDER node projectBootstrapp.js

			Take a look at the README for better documentation

			<----------------------------------------------------------------------------->

******************************************************************************************/

var exec = require('child_process').exec
,	log = require('util').log
,	targetFolder = process.env.target
,	configFile = {}
, 	filename = ''

exec('find '+targetFolder+'/init.json',function(err,stdout, stderr){
	//use the default init.json if it's not provided
	if(err){
		log('using the default init.json');
		configFile = require(__dirname+'/init.json')
	} else {
		configFile = require(targetFolder+'/init.json')
	}

	bootstrap();
});


var bootstrap = function(){
	// set working dir to target folder
	console.log(targetFolder);
	process.chdir(targetFolder);

	if(configFile){
		//init Git Repo
		exec('git init',function(err, stdout, stderr){

			if(err){
				log('Error on init git repo');
				log(err);
			}
			else{
				log('Init Git');
			}

			copyBoilerplate();
		});

		var copyBoilerplate = function(){
			if(configFile.boilerplate){
				if(configFile.boilerplate.match(/.zip$/)){
					//download the zip
					log('getting the boilerplate')
					filename = configFile.boilerplate.split('/');
					filename = filename[filename.length -1];

					exec('curl -O -L '+configFile.boilerplate,function(err,stdout, stderr){
						if(err){
							log('Error on getting the boilerplate');
							addSubmoules();
						}
						else{
							exec('unzip '+filename+' -d tmp',function(err,stdout, stderr){
								if(err){
									log('Error on extracting the boilerplate');
									addSubmoules();
								} else {
									exec('cp -R -n tmp/'+filename.replace('.zip','')+'/ '+targetFolder, function(err){
										log('Boilerplate downloaded and extracted');
										addSubmoules();
									});
								}
							});
						}

					});
				} else {
					//copy from a local folder
					exec('cp -R -n '+configFile.boilerplate+'/ '+targetFolder,function(err, stdout, stderr){
						if(err){
							log('Error on copy boilerplate')
							log(stderr);
						}
						else{
							log('Boilerplate copied');
						}

						addSubmoules();
					});
				}
			} else {
				addSubmoules();
			}

		}

		var addSubmoules = function(){
			//add Git submodules
			var addedNum = 0
			,	totNum = configFile.subModules.length
			;
			if(totNum > 0){
				configFile.subModules.forEach(function(modulePath){
					log('adding submodule: '+modulePath);
					exec('git submodule add '+modulePath, function(err, stdout, stderr){
						if(err){
							log('Error on add submodule '+modulePath)
							log(stderr);
						}
						else{
							log('Added submodule: '+modulePath);
						}
						addedNum ++;
						if(addedNum === totNum){
							addLibs();
						}

					});
				});	
			} else {
				addLibs();
			}
		};

		var addLibs = function(){
			//add Libs
			log('Adding libs');
			var addedNum = 0
			,	totNum = configFile.libs.length
			;
			if(totNum > 0){
				log('we got n. '+configFile.libs.length+' libs')
				// set working dir to lib pat
				process.chdir(targetFolder);

				//get libs
				process.chdir(configFile.libsPath);

				configFile.libs.forEach(function(libPath){
					log('loading lib: '+libPath);
					exec('curl -O '+libPath, function(err, stdout, stderr){
						if(err){
							log('Error on add libs '+libPath)
							log(stderr);
						}
						else{
							log('Added lib: '+libPath);
						}
					});
					addedNum ++;
					if(addedNum === totNum){
						createTodo();
					}
				});
			} else {
				createTodo();
			}
			
		};

		var createTodo = function(){
			// set back working dir to target folder
			process.chdir(targetFolder);
			log('create todo list')
			//Create TodoList
			if(configFile.todoName){

				exec('touch '+configFile.todoName,function(err, stdout, stderr){
					if(err){
						log(stderr)
					}
					else{
						log('todo list created')
					}

					commit();
				});
			} else {
				commit();
			}
		};

		var commit =  function(){
			//Create first commit
			log('Commiting initial status');

			//remove tmp folder
			exec('rm -rf tmp '+filename,function(){
				//stage and commit
				exec(' git add .',  function(err, stdout, stderr){
					if(err){
						log('Error on commit')
						log(err)
					}
					else{
						exec('git commit -m"'+configFile.commit+'"', function(err, stdout, stderr){
							if(err){
								log('Error on commit')
								log(stderr)
							}
							else{
								log('Initial status committed')
							}
						});
					}
				});
			});

			
			
		};
	} else {
		log('please provide a working init.json')
	}
}