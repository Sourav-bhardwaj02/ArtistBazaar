import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/api/api";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (product: any) => void;
}

export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    sku: "",
    stock: "",
    tags: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const { toast } = useToast();
  const [customTag, setCustomTag] = useState("");
  const availableTags = ["handmade", "traditional", "eco", "gift", "premium"];
  const selectedTagSet = useMemo(() => new Set(formData.tags), [formData.tags]);

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: selectedTagSet.has(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (!t) return;
    if (!selectedTagSet.has(t)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setCustomTag("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive",
      });
    }
    
    setImages(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate image input based on selected mode (XOR)
    if (imageMode === 'upload' && images.length === 0) {
      toast({ title: "No images uploaded", description: "Please upload at least one image or switch to URL mode.", variant: "destructive" });
      return;
    }
    if (imageMode === 'url') {
      const urls = imageUrl.split(',').map(u => u.trim()).filter(Boolean);
      const valid = urls.filter(u => /^https?:\/\//i.test(u));
      if (valid.length === 0) {
        toast({ title: "No image URLs", description: "Please enter at least one valid HTTPS image URL or switch to Upload mode.", variant: "destructive" });
        return;
      }
    }

    try {
      // 1) Upload images to backend (Cloudinary) to get imagesData with publicId
      let imagesData: Array<{ publicId: string; url: string; width?: number; height?: number; format?: string; size?: number; }> = [];
      if (imageMode === 'upload' && images.length > 0) {
        const uploadRes = await apiService.uploadImages(images as any);
        const uploaded = (uploadRes as any).images || [];
        imagesData = [...imagesData, ...uploaded];
      }

      // 1b) If URL mode, send URLs to backend to upload to Cloudinary and get imagesData
      if (imageMode === 'url') {
        const urls = imageUrl
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
          .filter((u) => /^https?:\/\//i.test(u));
        if (urls.length) {
          const byUrlRes = await apiService.uploadImagesByUrl(urls);
          const uploadedByUrl = (byUrlRes as any).images || [];
          imagesData = [...imagesData, ...uploadedByUrl];
        }
      }

      const imageUrls = imagesData.map((x) => x.url).filter(Boolean);

      // 2) Build payload for product creation
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: formData.stock ? Number(formData.stock) : 0,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        image: imageUrls[0],
        images: imageUrls,
        imagesData,
      } as any;

      const result = await apiService.createProduct(payload);

      toast({
        title: "Product added successfully!",
        description: `${formData.name} has been added to your catalog`,
      });

      // inside handleSubmit success
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        sku: "",
        stock: "",
        tags: [],
      });
      setImages([]);
      setImageUrl("");
      setImageMode('upload');
      onOpenChange(false);

      // Notify parent to refresh data
      const createdProduct = (result as any).product ?? result;
      if (onSuccess) onSuccess(createdProduct);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-primary">
        <DialogHeader>
          <DialogTitle className="text-primary">Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product listing for your catalog
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pottery">Pottery</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Textiles">Textiles</SelectItem>
                  <SelectItem value="Woodwork">Woodwork</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Sculpture">Sculpture</SelectItem>
                  <SelectItem value="Craft">Craft</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Product SKU"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="Available quantity"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed product description, specifications, features..."
              className="min-h-[100px]"
            />
          </div>

          {/* Tags selector */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${selectedTagSet.has(t)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"}
                  `}
                >
                  #{t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag and press Enter"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCustomTag}>Add</Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">#{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Product Images</Label>

            {/* Choose image input mode */}
            <RadioGroup
              value={imageMode}
              onValueChange={(v) => setImageMode((v as 'upload' | 'url'))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="mode-upload" />
                <Label htmlFor="mode-upload">Upload</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="mode-url" />
                <Label htmlFor="mode-url">Image URL</Label>
              </div>
            </RadioGroup>
            
            <div className={cn("border-2 border-dashed rounded-lg p-6", imageMode === 'url' ? 'opacity-50 pointer-events-none' : 'border-border') }>
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    Support: JPG, PNG, GIF up to 5MB each (max 5 images)
                  </p>
                </div>
              </div>
            </div>

            {imageMode === 'upload' && images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Optional: Image URL(s) */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL(s) (optional)</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... , https://... (you can paste multiple URLs separated by commas)"
                disabled={imageMode !== 'url'}
              />
              <p className="text-xs text-muted-foreground">
                Paste one or more HTTPS image URLs (comma-separated). These will be used along with any uploaded images.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}