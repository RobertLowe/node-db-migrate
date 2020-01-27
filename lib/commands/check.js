var path = require('path');
var log = require('db-migrate-shared').log;
var migrationHook = require('./helper/migration-hook.js');

async function prepare (internals, config) {
  try {
    await migrationHook(internals);
    var Migrator = require('../walker.js');
    var index = require('../../connect');

    if (internals.migrationMode) {
      internals.migrationsDir = path.resolve(
        internals.argv['migrations-dir'],
        internals.migrationMode
      );
      internals.argv['migrations-dir'] = internals.migrationsDir
    }

    if (!internals.argv.count) {
      internals.argv.count = Number.MAX_VALUE;
    }
    const migrator = await index.connect(
      {
        config: config.getCurrent().settings,
        internals: internals,
        prefix: 'migration'
      },
      Migrator
    );

    migrator.migrationsDir = path.resolve(internals.argv['migrations-dir']);

    await migrator.createMigrationsTable();
    log.verbose('migration table created');

    return migrator;
  } catch (err) {
    throw err;
  }
}

module.exports = async function (internals, config) {
  const migrator = await prepare(internals, config);

  try {
    const res = await migrator.check(internals.argv);
    return internals.onComplete(migrator, internals, null, res);
  } catch (err) {
    return internals.onComplete(migrator, internals, err);
  }
};
