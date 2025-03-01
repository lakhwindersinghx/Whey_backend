from PIL import Image, ImageEnhance, ImageFilter
import requests
from io import BytesIO
import pytesseract


def preprocess_image(image):
    """
    Apply preprocessing to enhance image quality for OCR.
    """
    # Convert image to grayscale
    image = image.convert("L")
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)
    
    # Apply thresholding (binarization)
    image = image.point(lambda p: p > 128 and 255)
    
    return image


def extract_text_from_image(image_url):
    """
    Download and extract text from an image using OCR.
    """
    try:
        # Download the image
        response = requests.get(image_url)
        if response.status_code != 200:
            print(f"Failed to download image: {image_url}")
            return None

        # Open the image
        img = Image.open(BytesIO(response.content))

        # Preprocess the image
        processed_img = preprocess_image(img)

        # Save the processed image (optional for debugging)
        processed_img.save("processed_image.jpg")

        # Perform OCR
        text = pytesseract.image_to_string(processed_img, config="--psm 6 --oem 3")

        return text.strip()
    except Exception as e:
        print(f"Error processing image {image_url}: {e}")
        return None


# Example Usage
image_url = "https://supplementsource.ca/cdn/shop/products/Allmax-Isoflex-Ch-stats_b35b5dab-bc7f-478b-82a2-22fbb25e0620-625224_75x75_crop_center.jpg?v=1629146992"
print("Extracting text from image...")
extracted_text = extract_text_from_image(image_url)
if extracted_text:
    print(f"\nExtracted Text:\n{extracted_text}")
else:
    print("Failed to extract text from the image.")
