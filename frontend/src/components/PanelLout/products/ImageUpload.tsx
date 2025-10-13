import { useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 8,
  className 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        // Create mock URL for demo purposes
        const mockUrl = `https://images.unsplash.com/photo-${Date.now() + i}?w=500&h=500&fit=crop&auto=format`;
        newImages.push(mockUrl);
      }
    }

    onImagesChange([...images, ...newImages]);
  }, [images, maxImages, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;
  const minImages = 3;
  const needsMoreImages = images.length < minImages;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <Card className={cn(
          'border-2 border-dashed transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          !canAddMore && 'opacity-50'
        )}>
          <CardContent className="p-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Upload Product Images
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop images here, or click to browse
                  <br />
                  {images.length}/{maxImages} images • Minimum {minImages} required
                </p>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={!canAddMore}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Requirements */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Image Requirements:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li className={needsMoreImages ? 'text-destructive' : 'text-green-600'}>
            Minimum {minImages} images required ({images.length}/{minImages})
          </li>
          <li>Maximum {maxImages} images allowed</li>
          <li>First image will be used as the main product image</li>
          <li>Supported formats: JPG, PNG, WebP</li>
          <li>Recommended size: 500x500px or larger</li>
        </ul>
      </div>
    </div>
  );
}