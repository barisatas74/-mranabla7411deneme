/**
 * Tum storage driver'larinin uydugu sozlesme.
 * "folder" = "products" / "categories"
 */

export type SaveFileResult = {
  /** Tarayici / istemci taraf gosterimi icin tam URL */
  url: string;
  filename: string;
  size: number;
};

export interface StorageDriver {
  /** Buffer'i belirli klasore kaydeder, public URL doner */
  saveBuffer(
    folder: string,
    filename: string,
    buffer: Buffer
  ): Promise<SaveFileResult>;

  /** URL ile gosterilen dosyayi siler. Yoksa false. */
  deleteByUrl(url: string): Promise<boolean>;
}
