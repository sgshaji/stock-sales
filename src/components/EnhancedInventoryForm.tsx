import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SmartInput } from "@/components/ui/form-validation"
import { ProgressiveFormSection } from "@/components/ui/progressive-form"
import { ContextualHelp } from "@/components/ui/contextual-help"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Info, Save, X, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const inventorySchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name too long"),
  sku: z.string().min(1, "SKU is required").regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens"),
  price: z.number().min(0, "Price must be positive").max(999999, "Price too high"),
  stock: z.number().min(0, "Stock must be positive").max(999999, "Stock too high"),
  description: z.string().max(500, "Description too long").optional(),
  category: z.string().max(50, "Category name too long").optional(),
  supplier: z.string().max(100, "Supplier name too long").optional(),
  minStockLevel: z.number().min(0).max(999999).optional(),
  maxStockLevel: z.number().min(0).max(999999).optional(),
}).refine((data) => {
  if (data.minStockLevel && data.maxStockLevel) {
    return data.maxStockLevel >= data.minStockLevel
  }
  return true
}, {
  message: "Maximum stock level must be greater than minimum",
  path: ["maxStockLevel"]
})

type InventoryFormData = z.infer<typeof inventorySchema>

interface EnhancedInventoryFormProps {
  onCancel: () => void
  onSubmit: (data: InventoryFormData) => void
  initialData?: Partial<InventoryFormData>
}

export function EnhancedInventoryForm({ 
  onCancel, 
  onSubmit,
  initialData 
}: EnhancedInventoryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skuSuggestion, setSkuSuggestion] = useState("")

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
      supplier: "",
      minStockLevel: 0,
      maxStockLevel: 100,
      ...initialData,
    },
  })

  // Smart SKU generation based on product name
  const generateSkuSuggestion = (name: string) => {
    if (!name) return ""
    
    const cleanName = name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(" ")
      .filter(word => word.length > 0)
      .slice(0, 3)
      .map(word => word.substring(0, 3))
      .join("-")
    
    const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, "0")
    return `${cleanName}-${randomSuffix}`
  }

  const handleSubmit = async (data: InventoryFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: `Product ${initialData ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} product`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Watch product name for SKU suggestions
  const productName = form.watch("name")
  const currentSku = form.watch("sku")

  React.useEffect(() => {
    if (productName && !currentSku) {
      const suggestion = generateSkuSuggestion(productName)
      setSkuSuggestion(suggestion)
    } else {
      setSkuSuggestion("")
    }
  }, [productName, currentSku])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-display-small">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          {initialData ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information - Always expanded */}
            <ProgressiveFormSection
              title="Basic Information"
              description="Essential product details"
              defaultExpanded={true}
              required={true}
              className="bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20"
            >
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          Product Name
                          <ContextualHelp
                            title="Product Name"
                            content="Enter a clear, descriptive name for your product. This will be displayed to customers and in reports."
                          />
                        </FormLabel>
                        <FormControl>
                          <SmartInput
                            placeholder="Enter product name"
                            validationState={
                              fieldState.error ? "invalid" : 
                              field.value && !fieldState.error ? "valid" : "idle"
                            }
                            validationMessage={fieldState.error?.message}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          SKU
                          <ContextualHelp
                            title="Stock Keeping Unit (SKU)"
                            content="A unique identifier for this product. Use uppercase letters, numbers, and hyphens. Example: HD-001 or MOUSE-WL-001"
                          />
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <SmartInput
                              placeholder="e.g., HD-001"
                              validationState={
                                fieldState.error ? "invalid" : 
                                field.value && !fieldState.error ? "valid" : "idle"
                              }
                              validationMessage={fieldState.error?.message}
                              {...field}
                            />
                            {skuSuggestion && !field.value && (
                              <button
                                type="button"
                                onClick={() => field.onChange(skuSuggestion)}
                                className="flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                              >
                                <Sparkles className="h-3 w-3" />
                                Use suggestion: {skuSuggestion}
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <DollarSign className="h-4 w-4" />
                          Price
                        </FormLabel>
                        <FormControl>
                          <SmartInput
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            validationState={
                              fieldState.error ? "invalid" : 
                              field.value > 0 && !fieldState.error ? "valid" : "idle"
                            }
                            validationMessage={fieldState.error?.message}
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Current Stock</FormLabel>
                        <FormControl>
                          <SmartInput
                            type="number"
                            placeholder="0"
                            validationState={
                              fieldState.error ? "invalid" : 
                              field.value >= 0 && !fieldState.error ? "valid" : "idle"
                            }
                            validationMessage={fieldState.error?.message}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ProgressiveFormSection>

            {/* Additional Details - Collapsed by default */}
            <ProgressiveFormSection
              title="Additional Details"
              description="Optional product information"
              defaultExpanded={false}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Electronics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Supplier Co." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ProgressiveFormSection>

            {/* Stock Management - Collapsed by default */}
            <ProgressiveFormSection
              title="Stock Management"
              description="Inventory level alerts and automation"
              defaultExpanded={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Minimum Stock Level
                        <ContextualHelp
                          title="Minimum Stock Level"
                          content="Set a minimum stock threshold. You'll be alerted when inventory falls below this level."
                        />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Maximum Stock Level
                        <ContextualHelp
                          title="Maximum Stock Level"
                          content="Set a maximum stock threshold for inventory planning and storage management."
                        />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ProgressiveFormSection>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex-1 sm:flex-none gap-2 h-12"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : `${initialData ? 'Update' : 'Create'} Product`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 sm:flex-none gap-2 h-12"
                size="lg"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
