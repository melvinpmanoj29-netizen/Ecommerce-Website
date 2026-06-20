export interface OrderItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdDate: string;
  items: OrderItem[];
  deliveredAt?: string | null;
  refundRequested?: boolean;
}