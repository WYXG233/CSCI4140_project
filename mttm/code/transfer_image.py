import sys
import os
import shutil

image_name = sys.argv[1]
folder_path = 'images/editing/'

for root, dirs, files in os.walk(folder_path, topdown=False):
    for file in files:
        file_path = os.path.join(root, file)
        os.remove(file_path)

shutil.copy2('images/' + image_name, folder_path + '1.jpg')