# license-extractor
---------------------

## Purpose

Sometimes the Legal Department gets cranky about open source and demands to read all the liceneses before you ship a product.  As anyone who works with open source code knows, it can kind of be a pain in the ass to get all these license files together.  Enter License-Extractor (swooooooosh!)

License-Extractor is a tool for extracting and recording all of the license files in your project.  Licenese can be output to `stdout`, a specific file, or to a directory (one file per licenese). You can then turn them over to Legal and let them deal with it.

## Installation

```shell
npm install licesne-extractor
```

## Usage

License-extractor can be used in one of three different modes:

* **output**: Output mode reads in each licenese and outputs the contents and some header info to the `stdout` device.  You can then pipe it wherever pleases you.

* **merge**: Merge mode reads in each license and outputs the contents and some header info to the `--target` file.

* **collect**: Collect mode copies each license to the `--target` directory giving it a more meaningful name, but keeping the contents unaltered.

If no mode is passed in on the command line, **output** mode is assumed.

### Output Mode Usage

Output mode reads in each licenese and outputs the contents and some header info to the `stdout` device.  You can then pipe it wherever pleases you.

```shell
licext [--mode output] [--source [dir]] [--noheaders]
```
`--mode` tells license-extractor the mode to use, in this case `output`. `--mode` is optional when doing `output` mode.

`--source` indicates the source directory of the project.  If no source is provided `.` is assumed.

`--noheaders` turns off the header information output before each license file.

### Merge Mode Usage

Merge mode reads in each license and outputs the contents and some header info to the `--target` file.

```shell
licext --mode merge [--source [dir]] [--target [file]] [--noheaders] [--overwrite]
```
`--mode` tells license-extractor the mode to use, in this case `merge`. In order to use `merge` mode you must include the `--mode merge` argument.

`--source` indicates the source directory of the project.  If no source is provided `.` is assumed.

`--target` is the target file to write all the output to.  If the file exists, an error will be generated unless `--overwrite` is included.

`--noheaders` turns off the header information output before each license file.

`--overwrite` will cause any prior existing `--target` to be removed prior to the `--target` file being written.

### Collect Mode Usage

Collect mode copies each license to the `--target` directory giving it a more meaningful name, but keeping the contents unaltered.

```shell
licext --mode collect [--source [dir]] [--target [dir]] [--overwrite]
```
`--mode` tells license-extractor the mode to use, in this case `collect`. In order to use `collect` mode you must include the `--mode collect` argument.

`--source` indicates the source directory of the project.  If no source is provided `.` is assumed.

`--target` is the target directory into which all the licenses files will be copied. If the directory exists, an error will be generated unless `--overwrite` is included.

`--overwrite` will cause any prior existing `--target` to be removed prior to the `--target` directory being written.

## Feedback

Feedback on this tool is always welcome and bugs submitted via github will always be answered.

Thanks for using license-extractor.
