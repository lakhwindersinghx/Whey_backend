import pytesseract
from PIL import Image
import cv2
import numpy as np

def preprocess_image(image_path):
    """
    Preprocess the image to improve OCR accuracy.
    """
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Adaptive Thresholding to enhance contrast
    processed_image = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                            cv2.THRESH_BINARY, 11, 2)

    return processed_image

def extract_text_from_image(image_path):
    """
    Extract text from an image using Tesseract OCR after preprocessing.
    """
    try:
        processed_image = preprocess_image(image_path)
        text = pytesseract.image_to_string(processed_image, config="--psm 6 --oem 3")
        return text
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return None
# import pytesseract
# from PIL import Image
# import cv2
# import numpy as np

# def preprocess_image(image_path):
#     """
#     Preprocess the image to improve OCR accuracy.
#     """
#     # Read image in grayscale
#     image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#     if image is None:
#         raise ValueError(f"Could not read image at {image_path}")

#     # (Optional) Scale up if the image is small
#     scale_factor = 2.0  # Try 1.5 or 2.0 to see what works best
#     height, width = image.shape
#     image = cv2.resize(image, (int(width * scale_factor), int(height * scale_factor)), interpolation=cv2.INTER_CUBIC)

#     # Adaptive Thresholding to enhance contrast
#     # You can adjust blockSize (11) or C (2) if needed
#     processed_image = cv2.adaptiveThreshold(
#         image,
#         255,
#         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#         cv2.THRESH_BINARY,
#         11,
#         2
#     )

#     # (Optional) Light denoising or morphological operations
#     # processed_image = cv2.medianBlur(processed_image, 3)

#     return processed_image

# def extract_text_from_image(image_path):
#     """
#     Extract text from an image using Tesseract OCR after preprocessing.
#     """
#     try:
#         processed_image = preprocess_image(image_path)

#         # Tesseract config:
#         # --psm 6: assume a single uniform block of text
#         # --oem 3: use LSTM-based OCR engine
#         # -l eng: use English language
#         # whitelist: restrict characters to typical label characters
#         config_str = (
#             "--psm 6 --oem 3 -l eng "
#             "-c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()%%,.-:"
#         )

#         text = pytesseract.image_to_string(processed_image, config=config_str)
#         return text

#     except Exception as e:
#         print(f"Error extracting text from image: {e}")
#         return None
