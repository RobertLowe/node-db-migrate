'use strict';

const File = require('./file.js');
const dbmUtil = require('db-migrate-shared').util;

const Template = function () {
  this.templateType = arguments[3];
  // this is a tweak for node 4 this can be translated
  // to ...arguments instead in upcoming node versions
  const Comp = File.bind.apply(File, [null].concat(dbmUtil.toArray(arguments)));
  this.file = new Comp();
};

Template.prototype.defaultCoffeeTemplate = function () {
  return [
    "'use strict';",
    '',
    'dbm = undefined',
    'type = undefined',
    'seed = undefined',
    '',
    'exports.setup = (options, seedLink) ->',
    '  dbm = options.dbmigrate',
    '  type = dbm.dataType',
    '  seed = seedLink',
    '',
    'exports.up = (db) ->',
    '  null',
    '',
    'exports.down = (db) ->',
    '  null',
    '',
    ''
  ].join('\n');
};

Template.prototype.defaultJsTemplate = function () {
  return [
    '',
    'export const up = (db, done) => {',
    '};',
    '',
    'export const down = (db, done) => {',
    '};',
    ''
  ].join('\n');
};

Template.prototype.defaultSqlTemplate = function () {
  return '/* Replace with your SQL commands */';
};

Template.prototype.sqlFileLoaderTemplate = function () {
  return [
    "'use strict';",
    '',
    'var dbm;',
    'var type;',
    'var seed;',
    "var fs = require('fs');",
    "var path = require('path');",
    'var Promise;',
    '',
    '/**',
    '  * We receive the dbmigrate dependency from dbmigrate initially.',
    '  * This enables us to not have to rely on NODE_PATH.',
    '  */',
    'exports.setup = function(options, seedLink) {',
    '  dbm = options.dbmigrate;',
    '  type = dbm.dataType;',
    '  seed = seedLink;',
    '  Promise = options.Promise;',
    '};',
    '',
    'exports.up = function(db) {',
    "  var filePath = path.join(__dirname, 'sqls', '" +
      this.file.name.replace('.js', '') +
      "-up.sql');",
    '  return new Promise( function( resolve, reject ) {',
    "    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){",
    '      if (err) return reject(err);',
    "      console.log('received data: ' + data);",
    '',
    '      resolve(data);',
    '    });',
    '  })',
    '  .then(function(data) {',
    '    return db.runSql(data);',
    '  });',
    '};',
    '',
    'exports.down = function(db) {',
    "  var filePath = path.join(__dirname, 'sqls', '" +
      this.file.name.replace('.js', '') +
      "-down.sql');",
    '  return new Promise( function( resolve, reject ) {',
    "    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){",
    '      if (err) return reject(err);',
    "      console.log('received data: ' + data);",
    '',
    '      resolve(data);',
    '    });',
    '  })',
    '  .then(function(data) {',
    '    return db.runSql(data);',
    '  });',
    '};',
    '',
    'exports._meta = {',
    '  "version": 1',
    '};',
    ''
  ].join('\n');
};

Template.prototype.sqlFileLoaderIgnoreOnInitTemplate = function () {
  return [
    "'use strict';",
    '',
    'var dbm;',
    'var type;',
    'var seed;',
    "var fs = require('fs');",
    "var path = require('path');",
    'var ignoreOnInit = false;',
    'var Promise;',
    '',
    '/**',
    '  * We receive the dbmigrate dependency from dbmigrate initially.',
    '  * This enables us to not have to rely on NODE_PATH.',
    '  */',
    'exports.setup = function(options, seedLink) {',
    '  dbm = options.dbmigrate;',
    '  ignoreOnInit = options.ignoreOnInit;',
    '  type = dbm.dataType;',
    '  seed = seedLink;',
    '  Promise = options.Promise;',
    '};',
    '',
    'exports.up = function(db, callback) {',
    "  var filePath = path.join(__dirname + '/sqls/" +
      this.file.name.replace('.js', '') +
      "-up.sql');",
    '  if (!ignoreOnInit) {',
    '    return new Promise( function( resolve, reject ) {',
    "       fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){",
    '         if (err) return reject(err);',
    "         console.log('received data: ' + data);",
    '',
    '         resolve(data);',
    '       });',
    '    })',
    '    .then(function(data) {',
    '      return db.runSql(data);',
    '    });',
    '  }',
    '  else {',
    "   console.log('ignoring on init: ' + filePath)",
    '   return null;',
    '  }',
    '};',
    '',
    'exports.down = function(db, callback) {',
    "  var filePath = path.join(__dirname + '/sqls/" +
      this.file.name.replace('.js', '') +
      "-down.sql');",
    '  return new Promise( function( resolve, reject ) {',
    "    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){",
    '      if (err) return reject(err);',
    "      console.log('received data: ' + data);",
    '',
    '      resolve(data);',
    '    });',
    '  })',
    '  .then(function(data) {',
    '    return db.runSql(data);',
    '  });',
    '};',
    '',
    'exports._meta = {',
    '  "version": 1',
    '};',
    ''
  ].join('\n');
};

Template.prototype.coffeeSqlFileLoaderTemplate = function () {
  return [
    "'use strict';",
    '',
    'dbm = undefined',
    'type = undefined',
    'seed = undefined',
    "fs = require 'fs'",
    "path = require 'path'",
    '',
    '#',
    '# We receive the dbmigrate dependency from dbmigrate initially.',
    '# This enables us to not have to rely on NODE_PATH.',
    '#',
    'exports.setup = (options, seedLink) ->',
    '  dbm = options.dbmigrate',
    '  type = dbm.dataType',
    '  seed = seedLink',
    '',
    '',
    'exports.up = (db, callback) ->',
    '  filePath = path.join "#{__dirname}/sqls/' +
      this.file.name.replace('.coffee', '') +
      '-up.sql"',
    "  fs.readFile filePath, {encoding: 'utf-8'}, (err,data) ->",
    '    return callback err if err',
    '',
    '    db.runSql data, callback',
    '',
    'exports.down = (db, callback) ->',
    '  filePath = path.join "#{__dirname}/sqls/' +
      this.file.name.replace('.coffee', '') +
      '-down.sql"',

    "  fs.readFile filePath, {encoding: 'utf-8'}, (err,data) ->",
    '    return callback err if err',
    '',
    '    db.runSql data, callback',
    ''
  ].join('\n');
};

Template.TemplateType = {
  DEFAULT_JS: 0,
  DEFAULT_SQL: 1,
  SQL_FILE_LOADER: 2,
  DEFAULT_COFFEE: 3,
  COFFEE_SQL_FILE_LOADER: 4,
  SQL_FILE_LOADER_IGNORE_ON_INIT: 5
};

Template.prototype.getTemplate = function () {
  switch (this.templateType) {
    case Template.TemplateType.DEFAULT_SQL:
      return this.defaultSqlTemplate();
    case Template.TemplateType.SQL_FILE_LOADER:
      return this.sqlFileLoaderTemplate();
    case Template.TemplateType.DEFAULT_COFFEE:
      return this.defaultCoffeeTemplate();
    case Template.TemplateType.COFFEE_SQL_FILE_LOADER:
      return this.coffeeSqlFileLoaderTemplate();
    case Template.TemplateType.SQL_FILE_LOADER_IGNORE_ON_INIT:
      return this.sqlFileLoaderIgnoreOnInitTemplate();
    case Template.TemplateType.DEFAULT_JS:
    /* falls through */
    default:
      return this.defaultJsTemplate();
  }
};

Template.prototype.write = function (callback) {
  return this.file.write(this.getTemplate()).nodeify(callback);
};

module.exports = Template;
