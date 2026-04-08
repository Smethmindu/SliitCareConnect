from PIL import Image

def geometric_crop(img_path, out_path):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    
    # We want a h x h box centered at exactly w // 2
    center_x = w // 2
    half_width = h // 2
    
    # Some padding to capture the whole shield (sometimes shields are wider than their height)
    # Actually let's just make the box slightly wider than the height
    box_w = int(h * 1.1)
    half_w = box_w // 2
    
    left = center_x - half_w
    right = center_x + half_w
    top = 0
    bottom = h
    
    # Keep it within bounds
    left = max(0, left)
    right = min(w, right)
    
    print(f"Geometric center crop: left={left}, right={right}, top={top}, bottom={bottom}")
    cropped = img.crop((left, top, right, bottom))
    cropped.save(out_path, 'PNG')
    print("Done cutting exactly to the center!")

geometric_crop('frontend/public/logo.png', 'frontend/public/logo.png')
