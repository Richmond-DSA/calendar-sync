import sync from '../index';

console.log('🚀 Starting local calendar-sync run...\n');

sync().then(
  () => console.log('\n✅ Sync completed successfully'),
  (error) => {
    console.error('\n❌ Sync failed:', error);
    process.exitCode = 1;
  },
);
