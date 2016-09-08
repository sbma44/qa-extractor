# qa-extractor
[![Coverage Status](https://coveralls.io/repos/github/ingalls/qa-extractor/badge.svg?branch=master)](https://coveralls.io/github/ingalls/qa-extractor?branch=master)
[![Circle CI](https://circleci.com/gh/ingalls/qa-extractor/tree/master.svg?style=svg)](https://circleci.com/gh/ingalls/qa-extractor/tree/master)
[![David DM](https://david-dm.org/ingalls/qa-extractor.svg)](https://david-dm.org/ingalls/qa-extractor)

Extract given features from a OSM-QA-Tiles (https://osmlab.github.io/osm-qa-tiles/)

## Usage Data

```
./index.js --input=<FILE.mbtiles> --output=<File.mbtiles> --selector=""
```

## Selector Options

### `and`

`and` is the default relation between terms. It is accomplished simply by specifying the next term required.

Example: `building highway` (building AND highway)


### `and not`

As with `and` it is accomplished by specifying the next term. `not` is accomplished by preceding the term with a `-`.
There should be no space between the not operation (`-`) and the next term.

Example: `building highway` (building AND NOT highway)

### Metadata Terms

#### `@id`

Search for the exact id of a feature. Values must be an integer.

Example: `@id:414317386`

#### `@type`

Search for the type of a feature. Values must be on of `node`, `way`, `area`

Example: `@type:way`

#### `@version`

Search for the edit version of a feature. Values must be an integer.

Example: `@version:1`

#### `@changeset`

Search for features in a given changeset. Values must be an integer.

Example: `@changeset:1234`

#### `@uid`

Search for features last edited by user id. Values must be an integer.

Example: `@uid:1234`

#### `@user`

Search for features last edited by username. Values must be a string.

Example: @user:ingalls

#### `@timestamp`

Search by last edit date of feature. Values must be integer.

Example: `@timestamp:12344`
