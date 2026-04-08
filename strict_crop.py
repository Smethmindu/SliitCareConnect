from PIL import Image

def strict_crop(img_path, out_path):
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    pixels = img.load()
    
    # We know background is mostly transparent now due to previous script,
    # except maybe for some stray noise.
    
    left = 0
    for x in range(width):
        # Count non-transparent pixels in this column
        solid_pixels = sum(1 for y in range(height) if pixels[x, y][3] > 50)
        if solid_pixels > height * 0.15: # At least 15% of the column must have solid colors
            left = max(0, x - 10) # 10px padding
            break
            
    right = width - 1
    for x in range(width - 1, -1, -1):
        solid_pixels = sum(1 for y in range(height) if pixels[x, y][3] > 50)
        if solid_pixels > height * 0.15:
            right = min(width - 1, x + 10) # 10px padding
            break
            
    if left < right:
        print(f"Precise horizontal crop from {left} to {right}. Width will be {right - left}")
        # Let's crop it tightly
        cropped_img = img.crop((left, 0, right, height))
        cropped_img.save(out_path, 'PNG')
        print("Success!")
    else:
        print("Failed to find dense area.")

strict_crop('frontend/public/logo.png', 'frontend/public/logo.png')
