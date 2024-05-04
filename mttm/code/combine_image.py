import sys
import os
from PIL import Image

changed_img = sys.argv[1]
bg_img = sys.argv[2]
original_name = sys.argv[3]

original_image = Image.open(bg_img)
replacement_image = Image.open(changed_img)


width, height = original_image.size
result_image = Image.new("RGB", (width, height))

filename = os.path.splitext(os.path.basename(original_name))[0]
with open('images/detected/' + filename + '.txt', "r") as file:
    lines = file.readlines()

start_x = int(lines[0].strip())
start_y = int(lines[1].strip())
end_x = int(lines[2].strip())
end_y = int(lines[3].strip())
replacement_image = replacement_image.resize((end_x - start_x, end_y - start_y))
for x in range(width):
    for y in range(height):
        if x >= start_x and x < end_x and y >= start_y and y < end_y:
            pixel = replacement_image.getpixel((x - start_x, y - start_y))
            if pixel == (0, 0, 0):
                pixel = original_image.getpixel((x, y))
        else:
            pixel = original_image.getpixel((x, y))
        
        result_image.putpixel((x, y), pixel)
result_image.save("images/editing_combine/1.jpg")