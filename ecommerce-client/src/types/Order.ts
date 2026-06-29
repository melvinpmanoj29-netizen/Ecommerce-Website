export interface OrderItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes?: string | null;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdDate: string;
  items: OrderItem[];
  deliveredAt?: string | null;
  refundRequested?: boolean;
  shippingAddress?: ShippingAddress | null;
  deliveryAgentName?: string | null;
}