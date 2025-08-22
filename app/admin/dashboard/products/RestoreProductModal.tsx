import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Product } from "@/features/product/productApi"

interface RestoreProductModalProps {
    product: Product
    onClose: () => void
    onRestore: (productId: string) => void
}

export function RestoreProductModal({ product, onClose, onRestore }: RestoreProductModalProps) {
    const handleConfirm = () => {
        onRestore(product.productId)
        onClose()
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Khôi phục sản phẩm</DialogTitle>
                </DialogHeader>
                <p>
                    Bạn có chắc chắn muốn <span className="font-semibold text-green-600">khôi phục</span> sản phẩm{" "}
                    <span className="font-semibold">{product.productName}</span>?
                </p>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleConfirm}>
                        Khôi phục
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
