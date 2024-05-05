import sys
import os
import matplotlib.pylab as plt
from API import transfer_style
from PIL import Image
style_image = sys.argv[1]
content_image = sys.argv[2]
save_path = sys.argv[3]

model_path = 'model/'
max_width = 2000
max_height = 1500

def resize_image(image_path):
    image = Image.open(image_path)
    
    width, height = image.size
    
    if width > max_width or height > max_height:
        ratio = min(max_width/width, max_height/height)
        new_width = int(width * ratio)
        new_height = int(height * ratio)
        
        resized_image = image.resize((new_width, new_height), Image.ANTIALIAS)
        
        resized_image.save(image_path)

resize_image(content_image)
resize_image(style_image)
img = transfer_style(content_image,style_image,model_path)

plt.imsave('images/' + save_path + '/1.jpg',img)