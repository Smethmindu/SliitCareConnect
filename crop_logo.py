from PIL import Image

def color_dist(c1, c2):
    return abs(c1[0]-c2[0]) + abs(c1[1]-c2[1]) + abs(c1[2]-c2[2])

def crop_by_columns(img_path, out_path):
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    pixels = img.load()
    
    bg1 = (255, 255, 255)
    bg2 = (206, 208, 205)
    
    TOLERANCE = 40
    
    def is_bg(x, y):
        p = pixels[x, y]
        return color_dist(p, bg1) < TOLERANCE or color_dist(p, bg2) < TOLERANCE or p[3] < 10
        
    left = 0
    for x in range(width):
        bg_count = sum(1 for y in range(height) if is_bg(x, y))
        if bg_count < height * 0.95:  # If more than 5% is NOT background, it's content
            left = x
            break
            
    right = width - 1
    for x in range(width - 1, -1, -1):
        bg_count = sum(1 for y in range(height) if is_bg(x, y))
        if bg_count < height * 0.95:
            right = x
            break
            
    if left < right:
        print(f"Cropping horizontal: {left} to {right}")
        # Make the background transparent in the cropped area
        # We can just run a safe pass turning exact bg colors to transparent
        for x in range(left, right + 1):
            for y in range(height):
                if is_bg(x, y):
                    pixels[x, y] = (0, 0, 0, 0)
                    
        cropped = img.crop((left, 0, right, height))
        
        # Now detect top/bottom
        c_width, c_height = cropped.size
        c_pixels = cropped.load()
        
        def is_c_bg(x, y):
            p = c_pixels[x, y]
            return p[3] == 0 or color_dist(p, bg1) < TOLERANCE or color_dist(p, bg2) < TOLERANCE
            
        top = 0
        for y in range(c_height):
            bg_count = sum(1 for x in range(c_width) if is_c_bg(x, y))
            if bg_count < c_width * 0.95:
                top = y
                break
                
        bottom = c_height - 1
        for y in range(c_height - 1, -1, -1):
            bg_count = sum(1 for x in range(c_width) if is_c_bg(x, y))
            if bg_count < c_width * 0.95:
                bottom = y
                break
                
        if top < bottom:
            print(f"Cropping vertical: {top} to {bottom}")
            final = cropped.crop((0, top, c_width, bottom))
            final.save(out_path, 'PNG')
            print("Successfully cropped!")
        else:
            cropped.save(out_path, 'PNG')
    else:
        print("Could not detect content.")

crop_by_columns('frontend/public/logo.png', 'frontend/public/logo.png')
