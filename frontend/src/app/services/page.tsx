'use client'

import { useState } from 'react'
import { useGetServicesQuery, useGetCategoriesQuery, useCreateOrderMutation } from '@/redux/api/serviceApi'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import { Search, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [selectedService, setSelectedService] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [ordering, setOrdering] = useState(false)

  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery({ category: selectedCat, search })
  const { data: categoriesData } = useGetCategoriesQuery()
  const [createOrder] = useCreateOrderMutation()

  const handleOrder = async () => {
    if (!selectedService) return
    setOrdering(true)
    try {
      await createOrder({ serviceId: selectedService._id, quantity }).unwrap()
      toast.success('Order placed successfully!')
      setShowModal(false)
      setQuantity(1)
    } catch {
      toast.error('Failed to place order')
    } finally {
      setOrdering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OTP Services</h1>
          <p className="mt-2 text-gray-600">Choose from our wide range of OTP verification services</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCat('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCat ? 'bg-primary text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            >
              All
            </button>
            {categoriesData?.data?.map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCat(cat._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCat === cat._id ? 'bg-primary text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {servicesLoading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData?.data?.map((service: any) => (
              <Card key={service._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(service.discountedPrice || service.price)}
                      </p>
                      {service.discountedPrice && (
                        <p className="text-sm text-gray-400 line-through">{formatCurrency(service.price)}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => { setSelectedService(service); setShowModal(true) }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Order
                    </Button>
                  </div>
                  <div className="mt-3 flex gap-2 text-xs text-gray-500">
                    {service.minQuantity && <span>Min: {service.minQuantity}</span>}
                    {service.maxQuantity && <span>Max: {service.maxQuantity}</span>}
                    {service.deliveryTime && <span>ETA: {service.deliveryTime}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setQuantity(1) }} title="Place Order" size="sm">
        {selectedService && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">{selectedService.name}</h3>
              <p className="text-sm text-gray-500">{formatCurrency(selectedService.discountedPrice || selectedService.price)} per unit</p>
            </div>
            <Input
              label="Quantity"
              type="number"
              min={selectedService.minQuantity || 1}
              max={selectedService.maxQuantity || 100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-bold text-lg">{formatCurrency((selectedService.discountedPrice || selectedService.price) * quantity)}</span>
            </div>
            <Button className="w-full" onClick={handleOrder} isLoading={ordering}>
              Place Order
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
