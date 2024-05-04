import sys
import os
from google_images_search import GoogleImagesSearch

key_word = sys.argv[1]
method = sys.argv[2]
folder_path = 'images/google_'+method+'/'

api_key = "" # Your own google image api key here
project_cx = "" # Your own google project cx here
gis = GoogleImagesSearch(api_key, project_cx)

_search_params = {
    'q': key_word,
    'num': 5,
    'fileType': 'jpg'
}

for root, dirs, files in os.walk(folder_path, topdown=False):
    for file in files:
        file_path = os.path.join(root, file)
        os.remove(file_path)

gis.search(search_params=_search_params, path_to_dir=folder_path)

file_list = os.listdir(folder_path)
image_files = [file for file in file_list if file.lower().endswith(('.jpg'))]
image_files.sort()

for i, file_name in enumerate(image_files, start=1):
    file_extension = os.path.splitext(file_name)[1]
    new_file_name = f"{i}{file_extension}"
    old_file_path = os.path.join(folder_path, file_name)
    new_file_path = os.path.join(folder_path, new_file_name)
    os.rename(old_file_path, new_file_path)
