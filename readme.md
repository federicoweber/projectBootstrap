# ProjectBootstrap
The aim of this project is to automate the creation of a new web project.
The script require node.js to run.
This script have been tested only on Mac OS X v10.7.

Author: [Federico Weber](http://federicoweber.com)


## The project creation steps
On run time the script will look for an **init.json** file iside the target folder.
This is the configuration file for the new project and will hold a list of depencencies and options.
If the **init.json** is not provided the global one, located in the same script folder, is used.

Then the script populate the project folder following this steps:

1. init a git repo
2. get the dependencies
3. create an optional empty doc to hold the project TODO list
4. add the created structure to git and generate the first commit

## The init.json file
Should contain the following elements:

- **boilerplate**: path to **local folder** or an url to a remote **.zip** file
- **submodules**: an array of valid urls to git submodules to load
- **libs**: an array that point to the urls for additional libraries to load using curl
- **commit message**: This is the first commit message
- **libsPath**: this is the path for the libs folder.
- **todoName**: *Optional* if provided it used to generate a todo file. *The extension must be included as well*

## Running the script
The target folder is passed with a **target** environment variable when the script is executed.
To make the process faster I'm also leverging a [keyboard maestro](http://www.keyboardmaestro.com/main/) macro to run the script on the current selected folder in *finder*.

Ex.

	$ target=PROJECT_FOLDER node projectBootstrapp.js

---

## License
Copyright (c) 2012 Federico Weber

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.