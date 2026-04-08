from PIL import Image
from collections import Counter

img = Image.open('frontend/public/logo.png').convert('RGBA')
pixels = list(img.crop((0, 0, 50, 50)).getdata())
print(Counter(pixels).most_common(5))
