/** Pedido de checkout — modelo mínimo (Tocks Custom). */

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface Order {
  id: string
  productSlug: string
  productName: string
  /** Valor integral em reais (BRL). */
  amount: number
  status: OrderStatus
  mpPaymentId: string | null
  mpPreferenceId: string | null
  createdAt: string
  updatedAt: string
}
