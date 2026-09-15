import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ResourceTable } from '../../components/admin/ResourceTable';
import { MigrationWizard } from '../../components/admin/MigrationWizard';

export function AdminResources() {
  const [migrationWizardOpen, setMigrationWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت منابع</h1>
          <p className="text-gray-400 text-sm mt-1">مدیریت یکپارچه منابع در تمام ارائه‌دهندگان</p>
        </div>
        <button
          onClick={() => setMigrationWizardOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          مهاجرت منبع
        </button>
      </div>

      {/* Resource Table */}
      <ResourceTable />

      {/* Migration Wizard */}
      <MigrationWizard
        isOpen={migrationWizardOpen}
        onClose={() => setMigrationWizardOpen(false)}
      />
    </div>
  );
}
