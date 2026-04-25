"use client";

import { useState } from "react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import { useAdminToast } from "@/components/admin/feedback/AdminFeedbackProvider";
import {
  AdminCheckboxField,
  AdminInputField,
  AdminTextAreaField,
} from "@/components/admin/forms/AdminFormFields";
import { validateSettingsForm } from "@/lib/admin";
import { settingsService } from "@/lib/services";
import { AdminSettings, AdminSettingsFormValues } from "@/types";

function toFormValues(settings: AdminSettings): AdminSettingsFormValues {
  return {
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    whatsappNumber: settings.whatsappNumber,
    address: settings.address,
    freeShippingLimit: String(settings.freeShippingLimit),
    taxRate: String(settings.taxRate),
    instagramUrl: settings.instagramUrl,
    cargoLeadTime: settings.cargoLeadTime,
    maintenanceMode: settings.maintenanceMode,
  };
}

export default function AdminSettingsForm({
  initialSettings,
}: {
  initialSettings: AdminSettings;
}) {
  const toast = useAdminToast();
  const [values, setValues] = useState<AdminSettingsFormValues>(
    toFormValues(initialSettings)
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminSettingsFormValues, string>>
  >({});

  function update<K extends keyof AdminSettingsFormValues>(
    key: K,
    value: AdminSettingsFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSettingsForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await settingsService.update({
      storeName: values.storeName,
      supportEmail: values.supportEmail,
      supportPhone: values.supportPhone,
      whatsappNumber: values.whatsappNumber,
      address: values.address,
      freeShippingLimit: Number(values.freeShippingLimit),
      taxRate: Number(values.taxRate),
      instagramUrl: values.instagramUrl,
      cargoLeadTime: values.cargoLeadTime,
      maintenanceMode: values.maintenanceMode,
    });

    toast({
      title: "Ayarlar kaydedildi",
      description: "Genel magaza ayarlari settings service uzerinden guncellendi.",
      variant: "success",
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Settings"
        title="Genel ayarlar"
        description="Ayni shared field sistemi ile iletisim, teslimat ve marka ayarlarinizi yonetin."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInputField
              label="Magaza adi"
              value={values.storeName}
              onChange={(value) => update("storeName", value)}
              error={errors.storeName}
            />
            <AdminInputField
              label="Destek e-postasi"
              value={values.supportEmail}
              onChange={(value) => update("supportEmail", value)}
              error={errors.supportEmail}
            />
            <AdminInputField
              label="Destek telefonu"
              value={values.supportPhone}
              onChange={(value) => update("supportPhone", value)}
              error={errors.supportPhone}
            />
            <AdminInputField
              label="WhatsApp numarasi"
              value={values.whatsappNumber}
              onChange={(value) => update("whatsappNumber", value)}
              error={errors.whatsappNumber}
            />
            <AdminInputField
              label="Ucretsiz kargo limiti"
              value={values.freeShippingLimit}
              onChange={(value) => update("freeShippingLimit", value)}
              error={errors.freeShippingLimit}
            />
            <AdminInputField
              label="Vergi orani"
              value={values.taxRate}
              onChange={(value) => update("taxRate", value)}
              error={errors.taxRate}
            />
            <AdminInputField
              className="md:col-span-2"
              label="Instagram URL"
              value={values.instagramUrl}
              onChange={(value) => update("instagramUrl", value)}
              error={errors.instagramUrl}
            />
            <AdminInputField
              className="md:col-span-2"
              label="Kargo teslim suresi"
              value={values.cargoLeadTime}
              onChange={(value) => update("cargoLeadTime", value)}
              error={errors.cargoLeadTime}
            />
            <AdminTextAreaField
              className="md:col-span-2"
              label="Adres"
              value={values.address}
              onChange={(value) => update("address", value)}
              error={errors.address}
            />
            <AdminCheckboxField
              className="md:col-span-2"
              label="Bakim modu (mock)"
              checked={values.maintenanceMode}
              onChange={(checked) => update("maintenanceMode", checked)}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Kaydet</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Bu ekran operasyon ayarlarinin form yapisini ve validasyonunu gostermek
            icin mock olarak hazirlandi.
          </p>
          <button
            type="submit"
            className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Ayarlari Kaydet
          </button>
        </section>
      </form>
    </div>
  );
}
