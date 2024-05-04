import sys
import os
import matplotlib.pylab as plt
from API import transfer_style

style_image = sys.argv[1]
content_image = sys.argv[2]
save_path = sys.argv[3]

model_path = 'model/'

img = transfer_style(content_image,style_image,model_path)

plt.imsave('images/' + save_path + '/1.jpg',img)