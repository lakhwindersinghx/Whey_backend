import easyocr
import cv2
import numpy as np

def preprocess_image(image_path):
    """
    Optional preprocessing: Read the image and convert it to grayscale.
    You can add additional preprocessing steps (denoising, thresholding, etc.) if needed.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found: {image_path}")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return gray

def extract_text_with_easyocr(image_path):
    """
    Extract text from an image using EasyOCR.
    Returns:
      - extracted_text: A string containing all recognized text.
      - result: The raw EasyOCR output for further processing if needed.
    """
    # Initialize the EasyOCR reader with English language
    reader = easyocr.Reader(['en'])
    
    # You can optionally preprocess the image; however, EasyOCR works best with the original color image.
    # For demonstration, we load the original image.
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found: {image_path}")
    
    # Run EasyOCR on the image
    result = reader.readtext(image)
    
    # Concatenate recognized text from each detected region
    extracted_text = "\n".join([text for (_, text, _) in result])
    return extracted_text.strip(), result

if __name__ == "__main__":
    image_path = "path/to/your/image.jpg"  # Update with your image file path
    text, result = extract_text_with_easyocr(image_path)
    
    print("Extracted Text:")
    print(text)
    
    # Optional: Visualize the OCR result by drawing bounding boxes on the image
    image = cv2.imread(image_path)
    for bbox, text, conf in result:
        # bbox is a list of four points: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
        pts = np.array(bbox, np.int32).reshape((-1, 1, 2))
        cv2.polylines(image, [pts], isClosed=True, color=(0, 255, 0), thickness=2)
        # Put recognized text near the top-left corner of the bounding box
        cv2.putText(image, text, (int(bbox[0][0]), int(bbox[0][1]-10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    
    cv2.imwrite("easyocr_result.jpg", image)
    print("Result image saved as easyocr_result.jpg")
