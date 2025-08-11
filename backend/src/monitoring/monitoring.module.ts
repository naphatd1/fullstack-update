import { Module } from '@nestjs/common';
import { MonitoringController } from './controllers/monitoring.controller';
import { SystemMetricsService } from './services/system-metrics.service';
import { DatabaseMetricsService } from './services/database-metrics.service';
import { FileStorageMetricsService } from './services/file-storage-metrics.service';
import { ApiMetricsService } from './services/api-metrics.service';
import { AlertingService } from './services/alerting.service';
import { SupabaseService } from '../common/services/supabase.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [MonitoringController],
  providers: [
    SystemMetricsService,
    DatabaseMetricsService,
    FileStorageMetricsService,
    ApiMetricsService,
    AlertingService,
    SupabaseService,
  ],
  exports: [
    SystemMetricsService,
    DatabaseMetricsService,
    FileStorageMetricsService,
    ApiMetricsService,
    AlertingService,
  ],
})
export class MonitoringModule {}