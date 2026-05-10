/**
 * @deprecated Bu giris noktasi artik kullanilmiyor.
 *
 * Sunucu tarafinda DB/mock secimi icin: `@/lib/services/server`
 * Istemci tarafindaki mutasyonlar icin: `@/lib/actions/admin`
 *
 * Geriye donuk uyumluluk amaciyla server modulunu re-export eder.
 */

export {
  productService,
  categoryService,
  orderService,
  settingsService,
  dashboardService,
  getServiceMode,
} from "@/lib/services/server";
