export interface ProductInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  expiryDays: number;
  quantity: number;
  tags: string[];
}

export interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export interface QRCodeInfoProps {
  productInfo: ProductInfo;
  onConfirm: (productInfo: ProductInfo) => void;
  onClose: () => void;
}

export interface StockItem {
  title: string;
  description?: string;
  category: string;
  quantity: number;
  expiry: string;
  available_from?: string;
  available_until?: string;
  pickupLocation: string;
  tags?: string[];
}
