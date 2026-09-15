import { useState } from 'react';
import { X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import type { Resource, Provider } from '../../types/admin';
import { resources, providers } from '../../data/admin-data';

interface MigrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResource?: Resource;
}

export function MigrationWizard({ isOpen, onClose, selectedResource }: MigrationWizardProps) {
  const [step, setStep] = useState(1);
  const [sourceResource, setSourceResource] = useState<Resource | null>(selectedResource || null);
  const [targetProvider, setTargetProvider] = useState<Provider | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const availableTargets = providers.filter(p => 
    sourceResource ? p.id !== sourceResource.providerId : true
  );

  const calculateCostEstimate = () => {
    if (!sourceResource || !targetProvider) return 0;
    // Demo calculation
    const baseCost = sourceResource.costPerHour * 24 * 30; // Monthly cost
    const migrationFee = targetProvider.type === 'INTL_EXTERNAL' ? 50 : 20;
    return baseCost + migrationFee;
  };

  const calculateDowntime = () => {
    if (!sourceResource) return 0;
    // Demo: Based on disk size
    return Math.max(5, (sourceResource.specs.disk || 100) / 20);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setStep(4); // Success
    }, 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setSourceResource(null);
    setTargetProvider(null);
    setIsExecuting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f1f] border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">جادوگر مهاجرت منابع</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > s ? 'bg-blue-600' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>انتخاب منبع</span>
            <span>انتخاب مقصد</span>
            <span>بررسی</span>
            <span>اجرا</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Source */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">منبع را انتخاب کنید</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => setSourceResource(resource)}
                    className={`w-full p-4 rounded-lg border text-right transition-colors ${
                      sourceResource?.id === resource.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{resource.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{resource.provider.name}</div>
                        <div className="text-xs text-gray-500 mt-1" dir="ltr">{resource.ipAddress}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {resource.specs.cpu} CPU / {(resource.specs.ram! / 1024).toFixed(1)} GB RAM
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!sourceResource}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Target */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">مقصد را انتخاب کنید</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableTargets.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setTargetProvider(provider)}
                    className={`w-full p-4 rounded-lg border text-right transition-colors ${
                      targetProvider?.id === provider.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{provider.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{provider.location}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {provider.type === 'INTERNAL' ? 'داخلی' :
                           provider.type === 'LOCAL_EXTERNAL' ? 'خارجی داخلی' : 'بین‌الملل'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        سلامت: {provider.healthScore}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                >
                  مرحله قبل
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!targetProvider}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pre-flight Check */}
          {step === 3 && sourceResource && targetProvider && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">بررسی پیش از پرواز</h3>
              
              <div className="space-y-4">
                {/* Migration Path */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-2">مسیر مهاجرت</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white">{sourceResource.provider.name}</div>
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                    <div className="text-sm text-white">{targetProvider.name}</div>
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-2">تخمین هزینه ماهانه</div>
                  <div className="text-2xl font-bold text-white">
                    ${calculateCostEstimate().toFixed(2)}
                    <span className="text-sm text-gray-400 mr-2">/ماه</span>
                  </div>
                  {targetProvider.type === 'INTL_EXTERNAL' && (
                    <div className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      افزایش هزینه به دلیل نرخ ارز
                    </div>
                  )}
                </div>

                {/* Downtime Estimate */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-2">تخمین زمان توقف</div>
                  <div className="text-xl font-bold text-white">
                    {calculateDowntime()} دقیقه
                  </div>
                </div>

                {/* Compatibility Check */}
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">سازگاری تأیید شد</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    تمام بررسی‌های پیش‌نیاز با موفقیت انجام شد
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                >
                  مرحله قبل
                </button>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  {isExecuting ? 'در حال اجرا...' : 'شروع مهاجرت'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">مهاجرت با موفقیت آغاز شد</h3>
              <p className="text-gray-400 text-sm mb-6">
                مهاجرت منبع "{sourceResource?.name}" به "{targetProvider?.name}" در حال انجام است
              </p>
              <button
                onClick={() => {
                  resetWizard();
                  onClose();
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                بستن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
