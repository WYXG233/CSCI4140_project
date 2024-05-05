# CSCI4140 Project - Online User-Specific Image Editor

Welcome to the CSCI4140 Group Project Page by Group 15. This project is to build an online user-specific image editor for which user can edit their own images with some specific objects or try to transfer their images into some ideal style depending on their own choices. This document provides an overview of this project, including the setting up steps and functions of the website.

## Functions

### Select Images from Google

In the editor, you can upload your own content or style images. Of course, if you have no idea about what to choose, you can enter some keywords and search through Google. Our website will show you the first 5 images according to your keywords, and you can choose one as your selection.

### Edit the Target Object Region

Compared to the traditional image editor, which can only deal with the whole image, our editor can support users in searching for some objects' names and directly editing the target region. You can input some keywords to search whether the target object exists, and then our system will show a list of target region images to allow the user to choose. You can either use basic CamanJS or try style transfer and then combine the edited images with the original ones. The keywords of our systems are based on the COCO2017 datasets<sup>1</sup>. 

### Style Transfer

In the style transfer part, users can upload their own style images (please use `.jpg` format), try some provided style images like Starry Night, or select some images from Google. Yeah, users can also make changes to the whole image or just change some target regions.

## To run the code...

1. Please download the pre-trained style transfer model's parameters [here](https://github.com/deepeshdm/Neural-Style-Transfer), and save the `model` folder into `/mttm/model`.
2. Please download the pre-trained object detection model from  [here](https://drive.google.com/drive/folders/10qDkMPIpKpeErDgE85jx7bCVwV5I3L0c?usp=sharing)<sup>2</sup>, and save it to `/mttm/Pix2SeqV2-Pytorch-master/weights`.
3. Run `pip install -r requirements.txt` to download basic Python libraries. You may need to manually download some additional requirements that may not included.
4. Move to `/mttm/` and run `npm install` to download NodeJS requirements.
5. To run the front-end server locally, you can go to `/html/` and run `http-server` (you may need to install it through `npm install http-server`), then you can visit the website at `http://127.0.0.1:8080` or other local URL. You can also use `http-server --cors` to allow CORS.
6. To run the back-end server locally, you can go to `/mttm/` and run `node app.js` to create a port at `http:/localhost:3000`.
7. To run the Google Image Search function, you need to follow the steps at [here](https://pypi.org/project/Google-Images-Search/) to get your own Google Image Search API key and Google project cx. Then, fill in the missing part in the `/mttm/code/search_image.py`.

## Notes
1. You may find the dataset [here](https://cocodataset.org/#home). You can also find all the supported keywords for our editor [here](https://github.com/WYXG233/CSCI4140_project/blob/main/html/lib/coco91_indices.json)
2. The pre-trained pix2Seq model is originally implemented [here](https://github.com/JJJYmmm/Pix2SeqV2-Pytorch/tree/master).

---

Thank you for visiting this project. If you have any further questions, please feel free to contact me.
