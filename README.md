# CSCI4140 Project - Online User-Specific Image Editor

Welcome to the CSCI4140 Group Project Page by Group 4. This project is to build an online user-specific image editor for which user can edit their own images with some specific objects, or try to transfer their images into some ideal style depends on their own choices. This document provides an overview of this project, including the setting up steps, functions of the website, .

## Functions

### Select Images from Google

In the editor, you can upload your own content or style images. Of course, if you have no idea about what to choose, you can enter some keywords and search through Google. Our website will show you the first 5 images according to your keywords, and you can choose one as your selection.

### Edit the Target Object Region

Compared to the traditional image editor, which can only deal with the whole image, our editor can support user to search some objects' names and directly edit the target region. You can input some keywords to search whether the target object is existed, then our system will show a list of target region images to allow user to choose. You can either use basic CamanJS or try style transfer and then combine the edited images to the original one.

### Style Transfer

In the style transfer part, users can upload their own style images (please use `.jpg` format), or try some provided style images like the Starry Night, or select some images form Google. Yeah users can also performs changes on the whole image, or just changes some target regions.

## To run the code...

1. Please download the pretrained style transfer model's parameters [here](https://github.com/deepeshdm/Neural-Style-Transfer), and save the `model` folder into `/mttm/model`.
2. Please download the pretrained object detection model from  [here](https://drive.google.com/drive/folders/10qDkMPIpKpeErDgE85jx7bCVwV5I3L0c?usp=sharing)<sup>1</sup>, and save it to `/mttm/Pix2SeqV2-Pytorch-master/weights`.
3. Run `pip install -r requirements.txt` to download basic python libaries. You may need to manully download some additional requirements which may not included.
4. Move to `/mttm/` and run `npm install` to download NodeJS requirements.
5. To run the front-end server locally, you can go to `/html/` and run `http-server` (you may need to install it through `npm install http-server`), then you can visit the website at `http://127.0.0.1:8080` or other local url.
6. To run the back-end server locally, you can go to `/mttm/` and run `node app.js` to create a port at `http:/localhost:3000`.
7. To run the Google Image Search function, you need to follow the step at [here](https://pypi.org/project/Google-Images-Search/) to get your own Google Image Search api key and Google project cx. And then fill in the missing part in the `/mttm/code/search_image.py`.

## Reference
1. The pretrained pix2Seq model is originally implemented [here](https://github.com/JJJYmmm/Pix2SeqV2-Pytorch/tree/master).

---

Thank you for visit this project. If you have any further questions, please feel free to contact with me.
