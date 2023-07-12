import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from '../db.config';

(async () => {
  const options: DataSourceOptions & SeederOptions = config;

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource);
})();
