import { createClient,  TimeSeriesEncoding, TimeSeriesAggregationType, TimeSeriesDuplicatePolicies } from 'redis';

export const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();
//await client.del('quadelTimeSeries');

export const quadelTimeSeries = await client.ts.create('quadelTimeSeries', {
    RETENTION: 86400000*30*7, // 1 day in milliseconds * 30 = month * 7 months
    ENCODING: TimeSeriesEncoding.UNCOMPRESSED, // No compression
    DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK // No duplicates
});

if (quadelTimeSeries === 'OK') {
    console.log('Created timeseries.');
  } else {
    console.log('Error creating timeseries :(');
    process.exit(1);
  }
  